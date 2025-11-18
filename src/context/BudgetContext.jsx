import { createContext, useContext, useState, useEffect } from 'react'

const BudgetContext = createContext()

export const useBudget = () => {
    const context = useContext(BudgetContext)
    if (!context) {
        throw new Error('useBudget must be used within a BudgetProvider')
    }
    return context
}

// Default categories with colors
const DEFAULT_CATEGORIES = [
    { id: 'food', name: 'Food & Dining', color: '#10b981', budgetLimit: 500 },
    { id: 'transport', name: 'Transportation', color: '#3b82f6', budgetLimit: 300 },
    { id: 'entertainment', name: 'Entertainment', color: '#8b5cf6', budgetLimit: 200 },
    { id: 'shopping', name: 'Shopping', color: '#ec4899', budgetLimit: 400 },
    { id: 'bills', name: 'Bills & Utilities', color: '#f59e0b', budgetLimit: 800 },
    { id: 'health', name: 'Health & Fitness', color: '#06b6d4', budgetLimit: 150 },
    { id: 'income', name: 'Income', color: '#10b981', budgetLimit: 0 },
    { id: 'other', name: 'Other', color: '#64748b', budgetLimit: 100 },
]

export const BudgetProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Load from localStorage on mount
    useEffect(() => {
        const savedTransactions = localStorage.getItem('budget_transactions')
        const savedCategories = localStorage.getItem('budget_categories')

        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions))
        }
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories))
        }
    }, [])

    // Save to localStorage whenever transactions change
    useEffect(() => {
        if (transactions.length > 0) {
            localStorage.setItem('budget_transactions', JSON.stringify(transactions))
        }
    }, [transactions])

    // Save to localStorage whenever categories change
    useEffect(() => {
        localStorage.setItem('budget_categories', JSON.stringify(categories))
    }, [categories])

    const addTransaction = (transaction) => {
        const newTransaction = {
            ...transaction,
            id: Date.now().toString(),
            date: transaction.date || new Date().toISOString(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    // Budgeting functions
    const addCategory = (category) => {
        const newCategory = {
            ...category,
            id: category.id || `${category.name.toLowerCase().replace(/\s+/g, '-')}`,
        };
        setCategories(prev => [...prev, newCategory]);
    };

    const updateCategory = (id, updates) => {
        setCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat)));
    };

    const deleteCategory = (id) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    };

    const addTransactions = (newTransactions) => {
        const transactionsWithIds = newTransactions.map((t, index) => ({
            ...t,
            id: `${Date.now()}-${index}`,
            date: t.date || new Date().toISOString(),
        }))
        setTransactions(prev => [...transactionsWithIds, ...prev])
    }

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id))
    }

    const updateTransaction = (id, updates) => {
        setTransactions(prev =>
            prev.map(t => (t.id === id ? { ...t, ...updates } : t))
        )
    }

    // Filter transactions by selected month and year
    const getFilteredTransactions = () => {
        return transactions.filter(t => {
            const tDate = new Date(t.date)
            return (
                tDate.getMonth() === selectedDate.getMonth() &&
                tDate.getFullYear() === selectedDate.getFullYear()
            )
        })
    }

    // Calculate balance up to the end of the selected month
    const getBalance = () => {
        return transactions.reduce((acc, t) => {
            const tDate = new Date(t.date)
            const isBeforeOrInMonth =
                tDate.getFullYear() < selectedDate.getFullYear() ||
                (tDate.getFullYear() === selectedDate.getFullYear() && tDate.getMonth() <= selectedDate.getMonth())

            if (isBeforeOrInMonth) {
                return t.type === 'income' ? acc + t.amount : acc - t.amount
            }
            return acc
        }, 0)
    }

    const getTotalIncome = () => {
        return getFilteredTransactions()
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0)
    }

    const getTotalExpenses = () => {
        return getFilteredTransactions()
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0)
    }

    const getExpensesByCategory = () => {
        const expenseMap = {}
        getFilteredTransactions()
            .filter(t => t.type === 'expense')
            .forEach(t => {
                if (!expenseMap[t.category]) {
                    expenseMap[t.category] = 0
                }
                expenseMap[t.category] += t.amount
            })
        return expenseMap
    }

    const getCategoryInfo = (categoryId) => {
        return categories.find(c => c.id === categoryId)
    }

    const value = {
        transactions,
        categories,
        selectedDate,
        setSelectedDate,
        addTransaction,
        addTransactions,
        deleteTransaction,
        updateTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        getBalance,
        getTotalIncome,
        getTotalExpenses,
        getExpensesByCategory,
        getCategoryInfo,
        getFilteredTransactions,
    }

    return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}
