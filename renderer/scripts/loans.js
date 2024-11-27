const creditForm = document.getElementById('credit-form');
const creditsList = document.getElementById('credits-list');

creditForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = document.getElementById('credit-type').value;
    const amount = parseFloat(document.getElementById('credit-amount').value);

    if (type === 'borrow') {
        addCredit(amount);
    } else if (type === 'repay') {
        repayCredit(amount);
    }
});

function addCredit(amount) {
    const li = document.createElement('li');
    li.textContent = `Взято кредит: ${amount.toFixed(2)} грн`;
    creditsList.appendChild(li);

    updateBalance(amount);
    updateCredit(amount);
}

function repayCredit(amount) {
    const li = document.createElement('li');
    li.textContent = `Погашено кредит: ${amount.toFixed(2)} грн`;
    creditsList.appendChild(li);

    updateBalance(-amount);
    updateCredit(-amount);
}

function updateCredit(amount) {
    const creditElement = document.getElementById('credit');
    const currentCredit = parseFloat(creditElement.textContent) || 0;
    creditElement.textContent = (currentCredit + amount).toFixed(2);
}

function updateBalance(amount) {
    const balanceElement = document.getElementById('balance');
    const currentBalance = parseFloat(balanceElement.textContent) || 0;
    balanceElement.textContent = (currentBalance + amount).toFixed(2);
}

function navigateBack() {
    window.electronAPI.navigate('index');
}
