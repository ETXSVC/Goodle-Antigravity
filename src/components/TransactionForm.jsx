import { useState } from 'react'
import { useBudget } from '../context/BudgetContext'
import { X } from 'phosphor-react'
import './TransactionForm.css'

const TransactionForm = ({ onClose, editTransaction = null }) => {
    const { addTransaction, updateTransaction, categories } = useBudget()

    const [formData, setFormData] = useState({
        type: editTransaction?.type || 'expense',
        amount: editTransaction?.amount || '',
        category: editTransaction?.category || 'food',
        description: editTransaction?.description || '',
        date: editTransaction?.date ? new Date(editTransaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        const transaction = {
            ...formData,
            amount: parseFloat(formData.amount),
        }

        if (editTransaction) {
            updateTransaction(editTransaction.id, transaction)
        } else {
            addTransaction(transaction)
        }

        onClose()
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const expenseCategories = categories.filter(c => c.id !== 'income')
    const displayCategories = formData.type === 'income'
        ? categories.filter(c => c.id === 'income')
        : expenseCategories

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="transaction-form">
                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: 'food' }))}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: 'income' }))}
                            >
                                Income
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            {displayCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="e.g., Grocery shopping"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editTransaction ? 'Update' : 'Add'} Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TransactionForm
