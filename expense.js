const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const formBtn = document.querySelector('.btn');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function formatRupee(num) {
    return parseFloat(num).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function editTransaction(id) {
    const transactionToEdit = transactions.find(t => t.id === id);
    
    text.value = transactionToEdit.text;
    amount.value = transactionToEdit.amount;
    
    formBtn.innerText = "Update Transaction";
    formBtn.style.backgroundColor = "var(--accent-green)"; 
    
    text.focus();

    removeTransaction(id);
}

function addTransaction(e) {
    e.preventDefault();
    
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }

    const transaction = {
        id: Math.floor(Math.random() * 100000000),
        text: text.value,
        amount: +amount.value 
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
    formBtn.innerText = "Add Transaction";
    formBtn.style.backgroundColor = "var(--text-main)";
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} 
        <div>
            <span style="margin-right: 10px;">${sign}₹${formatRupee(Math.abs(transaction.amount))}</span>
            <button class="edit-btn" onclick="editTransaction(${transaction.id})">edit</button>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </div>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `₹${formatRupee(total)}`;
    money_plus.innerText = `+₹${formatRupee(income)}`;
    money_minus.innerText = `-₹${formatRupee(expense)}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init(); 
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();
form.addEventListener('submit', addTransaction);