const instruments = {
  "GBPJPY": { point: 0.01 },
  "GBPUSD": { point: 0.0001 },
  "EURUSD": { point: 0.0001 },
  "NASDAQ": { point: 1.0 }
};

let lastResult = null;

function calculate() {
  const symbol = document.getElementById("symbol").value;
  const entry  = parseFloat(document.getElementById("entry").value);
  const sl     = parseFloat(document.getElementById("sl").value);
  const tp     = parseFloat(document.getElementById("tp").value);

  if (!entry || !sl || !tp) {
    document.getElementById("result").innerText = "Lengkapi semua data";
    return;
  }

  const point = instruments[symbol].point;

  const riskPoint   = Math.abs(entry - sl) / point;
  const rewardPoint = Math.abs(tp - entry) / point;
  const rr = rewardPoint / riskPoint;

  lastResult = {
    symbol,
    risk: riskPoint.toFixed(1),
    reward: rewardPoint.toFixed(1),
    rr: rr.toFixed(2)
  };

  document.getElementById("result").innerText =
    `Risk: ${lastResult.risk} | Reward: ${lastResult.reward} | RR = 1 : ${lastResult.rr}`;
}

function saveTrade() {
  if (!lastResult) {
    alert("Hitung RR dulu");
    return;
  }

  let trades = JSON.parse(localStorage.getItem("trades")) || [];
  trades.push(lastResult);
  localStorage.setItem("trades", JSON.stringify(trades));

  renderTrades();
}

function renderTrades() {
  const trades = JSON.parse(localStorage.getItem("trades")) || [];
  const tbody = document.getElementById("tradeList");
  tbody.innerHTML = "";

  trades.forEach(trade => {
    const row = `
      <tr>
        <td>${trade.symbol}</td>
        <td>${trade.risk}</td>
        <td>${trade.reward}</td>
        <td>1 : ${trade.rr}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Jalan otomatis saat web dibuka
renderTrades();
