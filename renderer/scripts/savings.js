const savingsForm = document.getElementById('savings-form');
const savingsList = document.getElementById('savings-list');

savingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('savings-amount').value);

    const li = document.createElement('li');
    li.textContent = `Відкладено: ${amount.toFixed(2)} грн`;
    savingsList.appendChild(li);

    updateSavings(amount);
    updateBalance(-amount);
});

function updateSavings(amount) {
    const savingsElement = document.getElementById('savings');
    const currentSavings = parseFloat(savingsElement.textContent) || 0;
    savingsElement.textContent = (currentSavings + amount).toFixed(2);
}

function updateBalance(amount) {
    const balanceElement = document.getElementById('balance');
    const currentBalance = parseFloat(balanceElement.textContent) || 0;
    balanceElement.textContent = (currentBalance + amount).toFixed(2);
}

function navigateBack() {
    window.electronAPI.navigate('index');
}
