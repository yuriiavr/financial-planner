const form = document.getElementById('income-form');
const incomeList = document.getElementById('income-list');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const source = document.getElementById('source').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const tax = parseFloat(document.getElementById('tax').value);

    const netIncome = amount - (amount * tax) / 100;

    const li = document.createElement('li');
    li.textContent = `${source}: ${netIncome.toFixed(2)} грн (з податком: ${tax}%)`;
    incomeList.appendChild(li);

    updateBalance(netIncome);
});

function updateBalance(income) {
    const balanceElement = document.getElementById('balance');
    const currentBalance = parseFloat(balanceElement.textContent) || 0;
    balanceElement.textContent = (currentBalance + income).toFixed(2);
}

function navigateBack() {
    window.electronAPI.navigate('index');
}
