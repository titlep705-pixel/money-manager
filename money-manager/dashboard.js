// เช็คล็อกอิน
const user = localStorage.getItem('loggedInUser');
if (!user) {
  alert('กรุณาเข้าสู่ระบบก่อน');
  window.location.href = 'index.html';
}

document.getElementById('currentUser').textContent = user;

// โหลดข้อมูลรายการจาก localStorage
let data = JSON.parse(localStorage.getItem('transactions')) || {};
if (!data[user]) data[user] = [];

updateUI();

function updateUI() {
  // คำนวณยอดเงินคงเหลือ
  let balance = 0;
  data[user].forEach(tx => {
    if (tx.type === 'deposit') balance += tx.amount;
    else balance -= tx.amount;
  });
  document.getElementById('balance').textContent = balance.toFixed(2);

  // แสดงประวัติ
  const ul = document.getElementById('historyList');
  ul.innerHTML = '';
  data[user].slice().reverse().forEach(tx => {
    const li = document.createElement('li');
    li.textContent = `${tx.type === 'deposit' ? 'ฝาก' : 'ถอน'}: ${tx.amount.toFixed(2)} บาท`;
    li.className = tx.type;
    ul.appendChild(li);
  });
}

function addTransaction() {
  const type = document.getElementById('actionType').value;
  let amount = parseFloat(document.getElementById('amount').value);
  if (!amount || amount <= 0) return alert('กรุณากรอกจำนวนเงินที่ถูกต้อง');

  // เช็คถอนเงินว่ามียอดพอไหม
  let balance = 0;
  data[user].forEach(tx => {
    if (tx.type === 'deposit') balance += tx.amount;
    else balance -= tx.amount;
  });

  if (type === 'withdraw' && amount > balance) {
    return alert('ยอดเงินไม่พอสำหรับถอน');
  }

  // บันทึกรายการ
  data[user].push({ type, amount });
  localStorage.setItem('transactions', JSON.stringify(data));
  updateUI();

  // เคลียร์ช่องกรอกเงิน
  document.getElementById('amount').value = '';
}

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
}
