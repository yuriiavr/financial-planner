const expensesForm = document.getElementById('expenses-form');
const expensesList = document.getElementById('expenses-list');

expensesForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const expenseName = document.getElementById('expense').value;
    const cost = parseFloat(document.getElementById('expense-cost').value);

    const li = document.createElement('li');
    li.textContent = `${expenseName}: ${cost.toFixed(2)} грн`;
    expensesList.appendChild(li);

    updateBalance(-cost);
});

function updateBalance(amount) {
    const balanceElement = document.getElementById('balance');
    const currentBalance = parseFloat(balanceElement.textContent) || 0;
    balanceElement.textContent = (currentBalance + amount).toFixed(2);
}

function navigateBack() {
    window.electronAPI.navigate('index');
}
