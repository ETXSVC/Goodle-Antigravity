import { useBudget } from '../context/BudgetContext'
import { TrendUp, TrendDown, Wallet, Plus } from 'phosphor-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import './Dashboard.css'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const Dashboard = ({ onAddTransaction, onViewChange }) => {
    const {
        getBalance,
        getTotalIncome,
        getTotalExpenses,
        getExpensesByCategory,
        categories,
        transactions,
        selectedDate,
    } = useBudget()

    const balance = getBalance()
    const totalIncome = getTotalIncome()
    const totalExpenses = getTotalExpenses()
    const expensesByCategory = getExpensesByCategory()

    // Expense Breakdown Data
    const categoryLabels = Object.keys(expensesByCategory).map(catId => {
        const cat = categories.find(c => c.id === catId)
        return cat ? cat.name : catId
    })

    const categoryColors = Object.keys(expensesByCategory).map(catId => {
        const cat = categories.find(c => c.id === catId)
        return cat ? cat.color : '#64748b'
    })

    const doughnutData = {
        labels: categoryLabels,
        datasets: [
            {
                data: Object.values(expensesByCategory),
                backgroundColor: categoryColors,
                borderColor: '#0a0e1a',
                borderWidth: 2,
            },
        ],
    }

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#cbd5e1', padding: 15, font: { size: 12, family: 'Inter' } },
            },
            tooltip: {
                backgroundColor: 'rgba(26, 31, 53, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: (context) => {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        return `${label}: $${value.toFixed(2)}`
                    },
                },
            },
        },
    }

    // Monthly Expenses & Income Data (2025)
    const year = 2025;
    const monthlyExpenses = Array.from({ length: 12 }, (_, i) => {
        return transactions
            .filter(t => t.type === 'expense')
            .filter(t => {
                const d = new Date(t.date);
                return d.getFullYear() === year && d.getMonth() === i;
            })
            .reduce((sum, t) => sum + t.amount, 0);
    });
    const monthlyIncome = Array.from({ length: 12 }, (_, i) => {
        return transactions
            .filter(t => t.type === 'income')
            .filter(t => {
                const d = new Date(t.date);
                return d.getFullYear() === year && d.getMonth() === i;
            })
            .reduce((sum, t) => sum + t.amount, 0);
    });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const barData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Expenses',
                data: monthlyExpenses,
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
            },
            {
                label: 'Income',
                data: monthlyIncome,
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.parsed.y || 0;
                        return `$${value.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#cbd5e1', callback: (value) => `$${value}` },
                grid: { color: 'rgba(255,255,255,0.1)' },
            },
            x: {
                ticks: { color: '#cbd5e1' },
                grid: { display: false },
            },
        },
    };

    // Budget vs Actual Data
    const totalBudgetLimit = categories.reduce((sum, cat) => sum + (cat.budgetLimit || 0), 0);
    const totalSpent = totalExpenses;
    const remainingBudget = Math.max(0, totalBudgetLimit - totalSpent);
    const isOverBudget = totalSpent > totalBudgetLimit;

    const budgetVsActualData = {
        labels: ['Spent', 'Remaining'],
        datasets: [
            {
                data: [totalSpent, remainingBudget],
                backgroundColor: [
                    isOverBudget ? '#ef4444' : '#3b82f6',
                    '#1e293b'
                ],
                borderColor: '#0a0e1a',
                borderWidth: 2,
            },
        ],
    };

    const budgetVsActualOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.parsed || 0;
                        return `$${value.toFixed(2)}`;
                    },
                },
            },
        },
        cutout: '70%',
    };

    // Budget Progress Data
    const budgetData = categories
        .filter(cat => cat.budgetLimit > 0)
        .map(cat => {
            const spent = expensesByCategory[cat.id] || 0
            const percentage = (spent / cat.budgetLimit) * 100
            return { ...cat, spent, percentage }
        })

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Track your financial overview</p>
                </div>
                <div className="dashboard-actions">
                    <button className="btn-secondary" onClick={() => onViewChange('categories')}>
                        Manage Budget
                    </button>
                    <button className="btn-primary" onClick={onAddTransaction}>
                        <Plus size={20} weight="bold" />
                        Add Transaction
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon balance">
                        <Wallet size={28} weight="duotone" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Current Balance</p>
                        <h2 className="stat-value">${balance.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon income">
                        <TrendUp size={28} weight="duotone" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Income</p>
                        <h2 className="stat-value income-text">${totalIncome.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon expense">
                        <TrendDown size={28} weight="duotone" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Expenses</p>
                        <h2 className="stat-value expense-text">${totalExpenses.toFixed(2)}</h2>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                {/* Expense Breakdown */}
                <div className="chart-card glass-card">
                    <h3 className="chart-title">Expense Breakdown</h3>
                    <div className="chart-container">
                        {Object.keys(expensesByCategory).length > 0 ? (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        ) : (
                            <div className="empty-state">
                                <p>No expenses yet. Add your first transaction!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Expenses */}
                <div className="chart-card glass-card">
                    <h3 className="chart-title">Monthly Expenses & Income (2025)</h3>
                    <div className="chart-container" style={{ height: '300px' }}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                {/* Budget vs Actual */}
                <div className="chart-card glass-card">
                    <h3 className="chart-title">Budget vs Actual</h3>
                    <div className="chart-container">
                        <div className="budget-vs-actual-overlay">
                            <p className="bva-percentage">
                                {totalBudgetLimit > 0 ? ((totalSpent / totalBudgetLimit) * 100).toFixed(0) : 0}%
                            </p>
                            <p className="bva-label">Used</p>
                        </div>
                        <Doughnut data={budgetVsActualData} options={budgetVsActualOptions} />
                    </div>
                </div>

                {/* Budget Progress */}
                <div className="budget-card glass-card">
                    <h3 className="chart-title">Budget Progress</h3>
                    <div className="budget-list">
                        {budgetData.length > 0 ? (
                            budgetData.map(cat => (
                                <div key={cat.id} className="budget-item">
                                    <div className="budget-header">
                                        <span className="budget-name">{cat.name}</span>
                                        <span className="budget-amount">
                                            ${cat.spent.toFixed(0)} / ${cat.budgetLimit}
                                        </span>
                                    </div>
                                    <div className="budget-bar">
                                        <div
                                            className="budget-progress"
                                            style={{
                                                width: `${Math.min(cat.percentage, 100)}%`,
                                                backgroundColor: cat.color,
                                            }}
                                        />
                                    </div>
                                    <p className="budget-percentage">
                                        {cat.percentage.toFixed(0)}% used
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No budget data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            {transactions.length > 0 && (
                <div className="recent-transactions glass-card">
                    <h3 className="chart-title">Recent Transactions</h3>
                    <div className="transaction-preview-list">
                        {transactions.slice(0, 5).map(transaction => {
                            const category = categories.find(c => c.id === transaction.category)
                            return (
                                <div key={transaction.id} className="transaction-preview-item">
                                    <div className="transaction-preview-info">
                                        <div
                                            className="transaction-preview-dot"
                                            style={{ backgroundColor: category?.color || '#64748b' }}
                                        />
                                        <div>
                                            <p className="transaction-preview-desc">{transaction.description}</p>
                                            <p className="transaction-preview-cat">{category?.name || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <p
                                        className={`transaction-preview-amount ${transaction.type === 'income' ? 'income-text' : 'expense-text'
                                            }`}
                                    >
                                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
