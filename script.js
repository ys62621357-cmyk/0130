let qtyInput = document.getElementById("qty");

function changeQty(btn, step) {
  let itemDiv = btn.parentElement;
  let input = itemDiv.querySelector("input");

  let current = parseFloat(input.value) || 0;
  let next = current + step;

  if (next < 0) next = 0;

  input.value = next;
}

function syncInput(input) {
  if (input.value < 0) {
    input.value = 0;
  }
}
function submitOrder() {
  let items = document.querySelectorAll(".item");
  let result = [];
  let summary = {};

  items.forEach(item => {
    let name = item.querySelector("span").innerText;
    let unitSelect = item.querySelector("select");
    let qtyInput = item.querySelector('input[type="number"]');
    let noteInput = item.querySelector('input[type="text"]');

    if (!unitSelect || !qtyInput || !noteInput) return;

    let unit = unitSelect.value;
    let qty = parseFloat(qtyInput.value) || 0;
    let note = noteInput.value;

    if (qty <= 0) return;

    result.push({ name, unit, qty, note });

    let key = name + "_" + unit;
    if (!summary[key]) summary[key] = { name, unit, total: 0 };
    summary[key].total += qty;
  });

  let order = {
    customer: document.getElementById("customerName").value,
    items: result,
    time: new Date().toISOString()
  };

  // 顯示本頁加總
  let text = "本次下單加總：\n";
  for (let k in summary) {
    let s = summary[k];
    text += `${s.name}：${s.total} ${s.unit}\n`;
  }
  alert(text);

  // 傳到 Google Sheet
  fetch("https://script.google.com/macros/s/AKfycbwl8pi4qkjjJdSraqIBQVCBeJkMc73uxzL_I0Ge9XW0xUr-d08vxvY0tpWyBg75_R_4/exec", {
    method: "POST",
    body: JSON.stringify(order),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => alert("送出成功！"))
  .catch(err => { console.error(err); alert("送出失敗"); });
}

