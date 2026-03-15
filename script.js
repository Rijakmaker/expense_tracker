const balanceDisplay = document.getElementById('profit-loss');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const trendText = document.getElementById('trend-text');
const clearBtn = document.getElementById('clear-btn');

let transactions = [];
let balanceHistory = [0];
let labels = ['Start'];

// Initialize the Graph
const ctx = document.getElementById('balanceChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Balance Flow (₹)',
            data: balanceHistory,
            borderColor: '#6c5ce7',
            backgroundColor: 'rgba(108, 92, 231, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    }
});

function formatCurrency(num) {
    return '₹' + num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
}

function addTransaction(e) {
    e.preventDefault();
    const text = document.getElementById('text');
    const amount = document.getElementById('amount');

    const transaction = {
        id: Date.now(),
        text: text.value,
        amount: parseFloat(amount.value)
    };

    transactions.push(transaction);
    updateUI();
    
    text.value = '';
    amount.value = '';
}

function updateUI() {
    list.innerHTML = '';
    transactions.forEach(t => {
        const item = document.createElement('li');
        item.classList.add(t.amount < 0 ? 'minus' : 'plus');
        item.innerHTML = `${t.text} <span>${t.amount < 0 ? '' : '+'}${t.amount.toFixed(2)}</span>`;
        list.appendChild(item);
    });

    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
    const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0);

    balanceDisplay.innerText = formatCurrency(total);
    balanceDisplay.style.color = total >= 0 ? 'var(--success)' : 'var(--danger)';
    
    moneyPlus.innerText = `+${formatCurrency(income)}`;
    moneyMinus.innerText = `-${formatCurrency(Math.abs(expense))}`;

    // --- UPDATED LOGIC HERE ---
    if (total >= 0) {
        trendText.innerHTML = "📈 Wealth is Rising";
        trendText.style.color = "var(--success)";
    } else {
        trendText.innerHTML = "📉 Wealth is Falling";
        trendText.style.color = "var(--danger)";
    }
    // --------------------------

    labels.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    balanceHistory.push(total);
    myChart.update();
}

clearBtn.addEventListener('click', () => {
    if(confirm("Wipe all data?")) {
        transactions = [];
        balanceHistory = [0];
        labels = ['Start'];
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = balanceHistory;
        updateUI();
        trendText.innerText = "Start adding data...";
        trendText.style.color = "#636e72";
    }
});

form.addEventListener('submit', addTransaction);
