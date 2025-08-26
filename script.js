const membersInput = document.getElementById('membersInput');
const addMembersBtn = document.getElementById('addMembersBtn');
const payerSelect = document.getElementById('payerSelect');
const amountInput = document.getElementById('amountInput');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expenseList = document.getElementById('expenseList');
const balanceList = document.getElementById('balanceList');

let members = [];
let expenses = [];

function save() {
  localStorage.setItem('members', JSON.stringify(members));
  localStorage.setItem('expenses', JSON.stringify(expenses));
}
function load() {
  members = JSON.parse(localStorage.getItem('members') || '[]');
  expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
  updateUI();
}

function updatePayerOptions() {
  payerSelect.innerHTML = '';
  members.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    payerSelect.appendChild(opt);
  });
}

function addMembers() {
  const input = membersInput.value.trim();
  if (!input) return alert('Enter at least one name (comma separated).');
  const arr = input.split(',').map(s => s.trim()).filter(Boolean);
  members = Array.from(new Set([...members, ...arr]));
  membersInput.value = '';
  updatePayerOptions();
  updateUI();
  save();
}

function addExpense() {
  const amt = parseFloat(amountInput.value);
  const payer = payerSelect.value;
  if (isNaN(amt) || !payer) return alert('Enter valid amount and select payer.');
  expenses.push({ amount: +amt.toFixed(2), payer, date: new Date().toISOString() });
  amountInput.value = '';
  updateUI();
  save();
}

function displayExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach(e => {
    const li = document.createElement('li');
    li.textContent = `${e.payer} paid ₹${e.amount.toFixed(2)}`;
    expenseList.appendChild(li);
  });
}

function calculateBalances() {
  const balances = {};
  members.forEach(m => balances[m] = 0);
  if (members.length === 0) return;

  expenses.forEach(e => {
    const share = e.amount / members.length;
    members.forEach(m => {
      if (m === e.payer) balances[m] += e.amount - share;
      else balances[m] -= share;
    });
  });

  balanceList.innerHTML = '';
  members.forEach(m => {
    const val = balances[m] || 0;
    const li = document.createElement('li');
    li.textContent = `${m}: ${val >= 0 ? 'Gets' : 'Owes'} ₹${Math.abs(val).toFixed(2)}`;
    balanceList.appendChild(li);
  });
}

function updateUI() {
  updatePayerOptions();
  displayExpenses();
  calculateBalances();
}

document.addEventListener('DOMContentLoaded', load);
addMembersBtn.addEventListener('click', addMembers);
addExpenseBtn.addEventListener('click', addExpense);
