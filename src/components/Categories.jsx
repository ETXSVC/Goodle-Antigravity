import { useState } from 'react';
import './Categories.css';
import { useBudget } from '../context/BudgetContext';


const Categories = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useBudget();
    const [newCat, setNewCat] = useState({ name: '', budgetLimit: '', color: '#ffffff' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCat(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd = () => {
        if (!newCat.name) return;
        const limit = parseFloat(newCat.budgetLimit) || 0;
        addCategory({ name: newCat.name, budgetLimit: limit, color: newCat.color });
        setNewCat({ name: '', budgetLimit: '', color: '#ffffff' });
    };

    const handleDelete = (id) => {
        deleteCategory(id);
    };

    // Simple inline edit for budget limit (optional)
    const handleUpdate = (id, limit) => {
        const parsed = parseFloat(limit) || 0;
        updateCategory(id, { budgetLimit: parsed });
    };

    return (
        <div className="categories-page glass-card">
            <h2 className="page-title">Categories</h2>
            <div className="add-category">
                <input
                    type="text"
                    name="name"
                    placeholder="Category name"
                    value={newCat.name}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="budgetLimit"
                    placeholder="Budget limit"
                    value={newCat.budgetLimit}
                    onChange={handleChange}
                />
                <input
                    type="color"
                    name="color"
                    value={newCat.color}
                    onChange={handleChange}
                />
                <button className="add-btn" onClick={handleAdd}>Add Category</button>
            </div>
            <ul className="category-list">
                {categories.map(cat => (
                    <li key={cat.id} className="category-item" style={{ borderLeft: `4px solid ${cat.color}` }}>
                        <span className="cat-name">{cat.name}</span>
                        <input
                            type="number"
                            className="cat-limit"
                            defaultValue={cat.budgetLimit}
                            onBlur={(e) => handleUpdate(cat.id, e.target.value)}
                        />
                        <button className="delete-btn" onClick={() => handleDelete(cat.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
