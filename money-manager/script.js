// จัดการระบบล็อกอินและสมัครบัญชี
function register() {
  const user = document.getElementById("regUser").value;
  const pass = document.getElementById("regPass").value;
  if (!user || !pass) return alert("กรอกข้อมูลให้ครบ");

  let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
  if (accounts[user]) return alert("ชื่อผู้ใช้นี้มีแล้ว");

  accounts[user] = pass;
  localStorage.setItem("accounts", JSON.stringify(accounts));
  alert("สมัครบัญชีสำเร็จ!");
}

function login() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
  if (accounts[user] && accounts[user] === pass) {
    localStorage.setItem("loggedInUser", user);
    window.location.href = "dashboard.html";
  } else {
    alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// เช็คการล็อกอินใน dashboard
if (window.location.pathname.endsWith("dashboard.html")) {
  const user = localStorage.getItem("loggedInUser");
  if (!user) window.location.href = "index.html";
  else document.getElementById("currentUser").textContent = user;
}

// จัดการรายรับรายจ่าย
let transactions = JSON.parse(localStorage.getItem("transactions")) || {};

function updateDisplay() {
  const user = localStorage.getItem("loggedInUser");
  const userTransactions = transactions[user] || [];

  const list = document.getElementById("list");
  const balanceElem = document.getElementById("balance");
  list.innerHTML = "";

  let balance = 0;
  userTransactions.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.desc} : ${t.amount} บาท`;
    li.className = t.type;
    list.appendChild(li);

    balance += t.type === "income" ? t.amount : -t.amount;
  });

  balanceElem.textContent = balance;
}

function addTransaction() {
  const user = localStorage.getItem("loggedInUser");
  const type = document.getElementById("type").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const desc = document.getElementById("desc").value;

  if (!amount || !desc) return alert("กรุณากรอกข้อมูลให้ครบ");

  if (!transactions[user]) transactions[user] = [];
  transactions[user].push({ type, amount, desc });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateDisplay();

  document.getElementById("amount").value = "";
  document.getElementById("desc").value = "";
}

function resetData() {
  const user = localStorage.getItem("loggedInUser");
  if (confirm("ลบข้อมูลทั้งหมด?")) {
    transactions[user] = [];
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateDisplay();
  }
}

if (window.location.pathname.endsWith("dashboard.html")) {
  updateDisplay();
}