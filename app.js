const instruments = {
  GBPJPY: { point: 0.01 },
  GBPUSD: { point: 0.0001 },
  EURUSD: { point: 0.0001 },
  NASDAQ: { point: 1 }
};

function saveTrade() {
  const entry = parseFloat(entryInput.value);
  const sl = parseFloat(slInput.value);
  const tp = parseFloat(tpInput.value);

  if (!entry || !sl || !tp) {
    alert("Harga belum lengkap");
    return;
  }

  const symbol = symbolInput.value;
  const point = instruments[symbol].point;

  const risk = Math.abs(entry - sl) / point;
  const reward = Math.abs(tp - entry) / point;
  const rr = (reward / risk).toFixed(2);

  const trade = {
    date: dateInput.value,
    symbol,
    direction: direction.value,
    riskPercent: riskPercent.value,
    rr,
    result: resultTrade.value,
    strategy: strategy.value
  };

  let trades = JSON.parse(localStorage.getItem("trades")) || [];
  trades.push(trade);
  localStorage.setItem("trades", JSON.stringify(trades));

  renderTrades();
}

function renderTrades() {
  const trades = JSON.parse(localStorage.getItem("trades")) || [];
  tradeList.innerHTML = "";

  trades.forEach(t => {
    tradeList.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.symbol}</td>
        <td>${t.direction}</td>
        <td>${t.riskPercent}%</td>
        <td>1:${t.rr}</td>
        <td>${t.result}</td>
        <td>${t.strategy}</td>
      </tr>
    `;
  });
}

renderTrades();
