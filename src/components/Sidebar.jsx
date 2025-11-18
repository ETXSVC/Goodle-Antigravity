import { useState } from 'react';
import { Wallet, ChartPie, List, X } from 'phosphor-react';
import MonthPicker from './MonthPicker';
import './Sidebar.css';

const Sidebar = ({ activeView, setActiveView }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavClick = (id) => {
        setActiveView(id);
        setIsOpen(false);
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: ChartPie },
        { id: 'transactions', label: 'Transactions', icon: List },
        { id: 'categories', label: 'Categories', icon: Wallet },
    ];

    return (
        <>
            <button
                className="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>

            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <Wallet size={32} weight="duotone" />
                        <h1 className="logo-text gradient-text">BudgetFlow</h1>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.id)}
                            >
                                <Icon size={24} weight={activeView === item.id ? 'fill' : 'regular'} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-filters">
                    <MonthPicker />
                </div>

                <div className="sidebar-footer">
                    <p className="footer-text">Made with ❤️</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar
