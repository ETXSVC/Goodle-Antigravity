import { useBudget } from '../context/BudgetContext'
import { CaretLeft, CaretRight, Calendar } from 'phosphor-react'
import './MonthPicker.css'

const MonthPicker = () => {
    const { selectedDate, setSelectedDate } = useBudget()

    const handlePrevMonth = () => {
        const newDate = new Date(selectedDate)
        newDate.setMonth(newDate.getMonth() - 1)
        setSelectedDate(newDate)
    }

    const handleNextMonth = () => {
        const newDate = new Date(selectedDate)
        newDate.setMonth(newDate.getMonth() + 1)
        setSelectedDate(newDate)
    }

    const formatMonth = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    return (
        <div className="month-picker">
            <button className="picker-btn" onClick={handlePrevMonth}>
                <CaretLeft size={20} weight="bold" />
            </button>
            <div className="current-month">
                <Calendar size={20} weight="duotone" />
                <span>{formatMonth(selectedDate)}</span>
            </div>
            <button className="picker-btn" onClick={handleNextMonth}>
                <CaretRight size={20} weight="bold" />
            </button>
        </div>
    )
}

export default MonthPicker
