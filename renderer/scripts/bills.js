const billsForm = document.getElementById('bills-form');
const billsList = document.getElementById('bills-list');

billsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const billName = document.getElementById('bill').value;
    const cost = parseFloat(document.getElementById('bill-cost').value);

    const li = document.createElement('li');
    li.textContent = `${billName}: ${cost.toFixed(2)} грн`;
    billsList.appendChild(li);

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
