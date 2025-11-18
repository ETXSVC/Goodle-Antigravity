import { useState, useEffect } from 'react'
import './App.css';
import Categories from './components/Categories';
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'
import { BudgetProvider } from './context/BudgetContext'

function App() {
    const [activeView, setActiveView] = useState('dashboard')
    const [showTransactionForm, setShowTransactionForm] = useState(false)

    return (
        <BudgetProvider>
            <div className="app">
                <Sidebar activeView={activeView} setActiveView={setActiveView} />
                <main className="main-content">
                    {activeView === 'dashboard' && <Dashboard onAddTransaction={() => setShowTransactionForm(true)} onViewChange={setActiveView} />}
                    {activeView === 'transactions' && <TransactionList onAddTransaction={() => setShowTransactionForm(true)} />}
                    {activeView === 'categories' && <Categories />}
                </main>
                {showTransactionForm && (
                    <TransactionForm onClose={() => setShowTransactionForm(false)} />
                )}
            </div>
        </BudgetProvider>
    )
}

export default App
