const foodForm = document.getElementById('food-form');
const foodList = document.getElementById('food-list');

foodForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const foodName = document.getElementById('food').value;
    const cost = parseFloat(document.getElementById('cost').value);

    const li = document.createElement('li');
    li.textContent = `${foodName}: ${cost.toFixed(2)} грн`;
    foodList.appendChild(li);

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
