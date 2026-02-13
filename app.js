function saveTrade() {
  const date = document.getElementById("date").value;
  const pair = document.getElementById("pair").value;
  const direction = document.getElementById("direction").value;
  const entry = parseFloat(document.getElementById("entry").value);
  const sl = parseFloat(document.getElementById("sl").value);
  const tp = parseFloat(document.getElementById("tp").value);
  const risk = document.getElementById("risk").value;
  const strategy = document.getElementById("strategy").value;
  const result = document.getElementById("result").value;

  if (!entry || !sl || !tp) {
    alert("Entry, SL, dan TP wajib diisi");
    return;
  }

  const riskPips = Math.abs(entry - sl);
  const rewardPips = Math.abs(tp - entry);
  const rr = (rewardPips / riskPips).toFixed(2);

  const table = document.getElementById("history");
  const row = table.insertRow();

  row.innerHTML = `
    <td>${date}</td>
    <td>${pair}</td>
    <td>${direction}</td>
    <td>${risk}%</td>
    <td>1:${rr}</td>
    <td class="${result === 'Win' ? 'badge-win' : 'badge-loss'}">${result}</td>
    <td>${strategy}</td>
  `;
}
