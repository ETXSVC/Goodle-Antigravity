import { useState, useRef } from 'react'
import { useBudget } from '../context/BudgetContext'
import { Plus, Trash, Pencil, Funnel, UploadSimple, SortAscending, SortDescending } from 'phosphor-react'
import TransactionForm from './TransactionForm'
import './TransactionList.css'

const TransactionList = ({ onAddTransaction }) => {
    const { transactions, categories, deleteTransaction, addTransactions } = useBudget()
    const [filterType, setFilterType] = useState('all')
    const [filterCategory, setFilterCategory] = useState('all')
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')
    const [editingTransaction, setEditingTransaction] = useState(null)
    const fileInputRef = useRef(null)

    const filteredTransactions = transactions.filter(t => {
        const typeMatch = filterType === 'all' || t.type === filterType
        const categoryMatch = filterCategory === 'all' || t.category === filterCategory
        return typeMatch && categoryMatch
    })

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
            case 'date':
                comparison = new Date(a.date) - new Date(b.date)
                break
            case 'amount':
                comparison = a.amount - b.amount
                break
            case 'description':
                comparison = a.description.localeCompare(b.description)
                break
            default:
                comparison = 0
        }
        return sortOrder === 'asc' ? comparison : -comparison
    })

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(id)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target.result
                const lines = text.split('\n')
                const newTransactions = []

                // Skip header row (index 0)
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim()
                    if (!line) continue

                    // Simple CSV split (doesn't handle quoted commas)
                    const [date, description, categoryName, amount, type] = line.split(',').map(item => item.trim())

                    if (date && description && amount && type) {
                        // Find category ID by name (case-insensitive)
                        const category = categories.find(c => c.name.toLowerCase() === categoryName?.toLowerCase())?.id || 'other'

                        newTransactions.push({
                            date,
                            description,
                            category,
                            amount: parseFloat(amount),
                            type: type.toLowerCase()
                        })
                    }
                }

                if (newTransactions.length > 0) {
                    addTransactions(newTransactions)
                    alert(`Successfully imported ${newTransactions.length} transactions!`)
                } else {
                    alert('No valid transactions found in CSV.')
                }
            } catch (error) {
                console.error('Error parsing CSV:', error)
                alert('Error parsing CSV file. Please check the format.')
            }

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
        reader.readAsText(file)
    }

    return (
        <div className="transaction-list-page">
            <header className="dashboard-header">
                <div>
                    <h1 className="page-title">Transactions</h1>
                    <p className="page-subtitle">View and manage all your transactions</p>
                </div>
                <div className="header-actions">
                    <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />
                    <button
                        className="btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadSimple size={20} weight="bold" />
                        Import CSV
                    </button>
                    <button className="btn-primary" onClick={onAddTransaction}>
                        <Plus size={20} weight="bold" />
                        Add Transaction
                    </button>
                </div>
            </header>

            <div className="filters glass-card">
                <div className="filter-icon">
                    <Funnel size={20} weight="duotone" />
                </div>
                <div className="filter-group">
                    <label className="filter-label">Type</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label className="filter-label">Category</label>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label className="filter-label">Sort By</label>
                    <div className="sort-controls">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="date">Date</option>
                            <option value="amount">Amount</option>
                            <option value="description">Description</option>
                        </select>
                        <button
                            className="sort-order-btn"
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            title={sortOrder === 'asc' ? "Ascending" : "Descending"}
                        >
                            {sortOrder === 'asc' ? <SortAscending size={20} /> : <SortDescending size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="transactions-container">
                {sortedTransactions.length > 0 ? (
                    <div className="transactions-grid">
                        {sortedTransactions.map(transaction => {
                            const category = categories.find(c => c.id === transaction.category)
                            return (
                                <div key={transaction.id} className="transaction-card glass-card">
                                    <div className="transaction-main">
                                        <div
                                            className="transaction-color-bar"
                                            style={{ backgroundColor: category?.color || '#64748b' }}
                                        />
                                        <div className="transaction-info">
                                            <h3 className="transaction-description">{transaction.description}</h3>
                                            <div className="transaction-meta">
                                                <span className="transaction-category">{category?.name || 'Unknown'}</span>
                                                <span className="transaction-date">{formatDate(transaction.date)}</span>
                                            </div>
                                        </div>
                                        <div className="transaction-amount-section">
                                            <p
                                                className={`transaction-amount ${transaction.type === 'income' ? 'income-text' : 'expense-text'
                                                    }`}
                                            >
                                                {transaction.type === 'income' ? '+' : '-'}$
                                                {transaction.amount.toFixed(2)}
                                            </p>
                                            <span className={`transaction-type-badge ${transaction.type}`}>
                                                {transaction.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="transaction-actions">
                                        <button
                                            className="action-btn edit"
                                            onClick={() => setEditingTransaction(transaction)}
                                            title="Edit transaction"
                                        >
                                            <Pencil size={18} weight="duotone" />
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDelete(transaction.id)}
                                            title="Delete transaction"
                                        >
                                            <Trash size={18} weight="duotone" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="empty-state glass-card">
                        <p className="empty-text">No transactions found</p>
                        <p className="empty-subtext">Add your first transaction to get started!</p>
                        <button className="btn-primary" onClick={onAddTransaction}>
                            <Plus size={20} weight="bold" />
                            Add Transaction
                        </button>
                    </div>
                )}
            </div>

            {editingTransaction && (
                <TransactionForm
                    editTransaction={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                />
            )}
        </div>
    )
}

export default TransactionList
