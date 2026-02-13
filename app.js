const CONTRACT = {
  GBPJPY: 100000,
  GBPUSD: 100000,
  EURUSD: 100000,
  NASDAQ: 20
};

let trades = JSON.parse(localStorage.getItem("trades")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let startingBalance = 5000;
let editIndex = null;
let chart;

// ===== PNL =====
function calculatePNL(pair, entry, sl, tp, lot, result) {
  const risk = Math.abs(entry - sl) * lot * CONTRACT[pair];
  const reward = Math.abs(tp - entry) * lot * CONTRACT[pair];
  return result === "win" ? reward : -risk;
}

// ===== SAVE / EDIT TRADE =====
function saveTrade() {
  const trade = {
    date: date.value,
    pair: pair.value,
    lot: +lot.value,
    pnl: calculatePNL(pair.value, +entry.value, +sl.value, +tp.value, +lot.value, result.value)
  };

  if (editIndex !== null) {
    trades[editIndex] = trade;
    editIndex = null;
  } else {
    trades.push(trade);
  }

  localStorage.setItem("trades", JSON.stringify(trades));
  clearForm();
  renderAll();
}

// ===== DELETE =====
function deleteTrade(i) {
  if (confirm("Delete trade?")) {
    trades.splice(i, 1);
    localStorage.setItem("trades", JSON.stringify(trades));
    renderAll();
  }
}

// ===== EDIT =====
function editTrade(i) {
  const t = trades[i];
  editIndex = i;
  date.value = t.date;
  pair.value = t.pair;
  lot.value = t.lot;
}

// ===== DEPOSIT / WITHDRAW =====
function addTransaction() {
  const tx = {
    date: txDate.value,
    type: txType.value,
    amount: +txAmount.value
  };

  transactions.push(tx);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderAll();
}

// ===== EQUITY =====
function calculateEquity() {
  let equity = startingBalance;
  transactions.forEach(t => equity += t.type === "deposit" ? t.amount : -t.amount);
  trades.forEach(t => equity += t.pnl);
  return equity;
}

// ===== EQUITY CURVE =====
function drawEquityCurve() {
  let equity = startingBalance;
  const points = [];

  transactions.forEach(t => {
    equity += t.type === "deposit" ? t.amount : -t.amount;
    points.push(equity);
  });

  trades.forEach(t => {
    equity += t.pnl;
    points.push(equity);
  });

  if (chart) chart.destroy();

  chart = new Chart(equityChart, {
    type: "line",
    data: {
      labels: points.map((_, i) => i + 1),
      datasets: [{ data: points, tension: 0.3 }]
    },
    options: { plugins: { legend: { display: false } } }
  });
}

// ===== EXPORT CSV =====
function exportCSV() {
  let csv = "Date,Pair,Lot,PNL\n";
  trades.forEach(t => {
    csv += `${t.date},${t.pair},${t.lot},${t.pnl}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "trading_journal.csv";
  link.click();
}

// ===== RENDER =====
function renderAll() {
  tradeTable.innerHTML = "";
  trades.forEach((t, i) => {
    tradeTable.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.pair}</td>
        <td>${t.lot}</td>
        <td style="color:${t.pnl > 0 ? '#22c55e' : '#ef4444'}">$${t.pnl.toFixed(2)}</td>
        <td>
          <button onclick="editTrade(${i})">✏️</button>
          <button onclick="deleteTrade(${i})">🗑</button>
        </td>
      </tr>
    `;
  });

  equity.textContent = calculateEquity().toFixed(2);
  drawEquityCurve();
}

function clearForm() {
  document.querySelectorAll("input").forEach(i => i.value = "");
}

renderAll();
