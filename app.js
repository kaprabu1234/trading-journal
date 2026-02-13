let trades = JSON.parse(localStorage.getItem("trades")) || [];
let editIndex = null;

function saveTrade() {
  const trade = {
    id: Date.now(),
    date: date.value,
    pair: pair.value,
    direction: direction.value,
    entry: entry.value,
    sl: sl.value,
    tp: tp.value,
    risk: risk.value,
    strategy: strategy.value,
    result: result.value
  };

  if (!trade.entry || !trade.sl || !trade.tp) {
    alert("Entry, SL, dan TP wajib diisi");
    return;
  }

  if (editIndex !== null) {
    trades[editIndex] = trade;
    editIndex = null;
  } else {
    trades.push(trade);
  }

  localStorage.setItem("trades", JSON.stringify(trades));
  renderTrades();
  clearForm();
}

function renderTrades() {
  history.innerHTML = "";

  trades.forEach((t, i) => {
    const rr = (
      Math.abs(t.tp - t.entry) /
      Math.abs(t.entry - t.sl)
    ).toFixed(2);

    history.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.pair}</td>
        <td>${t.direction}</td>
        <td>${t.risk}%</td>
        <td>1:${rr}</td>
        <td>${t.result}</td>
        <td>${t.strategy}</td>
        <td>
          <button onclick="editTrade(${i})">✏️</button>
          <button onclick="deleteTrade(${i})">🗑</button>
        </td>
      </tr>
    `;
  });
}

function editTrade(index) {
  const t = trades[index];
  editIndex = index;

  date.value = t.date;
  pair.value = t.pair;
  direction.value = t.direction;
  entry.value = t.entry;
  sl.value = t.sl;
  tp.value = t.tp;
  risk.value = t.risk;
  strategy.value = t.strategy;
  result.value = t.result;
}

function deleteTrade(index) {
  if (confirm("Hapus trade ini?")) {
    trades.splice(index, 1);
    localStorage.setItem("trades", JSON.stringify(trades));
    renderTrades();
  }
}

function clearForm() {
  document.querySelectorAll("input, textarea").forEach(i => i.value = "");
}

renderTrades();
