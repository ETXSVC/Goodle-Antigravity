# BudgetFlow - Personal Finance Application

BudgetFlow is a modern, responsive personal finance application designed to help users track expenses, manage budgets, and visualize their financial health. Built with React and Vite, it features a premium dark mode design with glassmorphism aesthetics.

## Features

-   **Dashboard Overview**: Real-time summary of Balance, Income, and Expenses.
-   **Transaction Management**: Add, edit, and delete income/expense transactions.
-   **Budget Tracking**: Set monthly budgets for different categories and track progress.
-   **Visualizations**:
    -   **Expense Breakdown**: Bar chart showing monthly income vs. expenses.
    -   **Budget vs Actual**: Doughnut chart visualizing budget utilization.
-   **Data Persistence**: All data is saved locally using `localStorage`.
-   **CSV Import**: Bulk import transactions from CSV files.
-   **Date Filtering**: Filter all data by month and year.
-   **Responsive Design**: Fully optimized for desktop and mobile devices.

## Tech Stack

-   **Frontend**: React 18
-   **Build Tool**: Vite
-   **Styling**: Vanilla CSS (Variables, Flexbox/Grid, Animations)
-   **Icons**: Phosphor Icons
-   **Charts**: Chart.js (react-chartjs-2)

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd "Goodle Antigravity"
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## Deployment

To deploy this application to a remote server:

1.  **Build the project**:
    ```bash
    npm run build
    ```
    This creates a `dist` folder with production-ready assets.

2.  **Deploy**:
    -   **Static Hosting (Netlify/Vercel)**: Drag and drop the `dist` folder.
    -   **Web Server**: Upload the contents of `dist` to your server's public directory.

For detailed deployment instructions, see [.agent/workflows/deploy.md](.agent/workflows/deploy.md).

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Dashboard.jsx   # Main overview with charts
│   ├── Sidebar.jsx     # Navigation and filters
│   ├── TransactionList.jsx # Transaction history
│   └── ...
├── context/
│   └── BudgetContext.jsx # Global state management
├── App.jsx             # Main layout
├── index.css           # Global styles and variables
└── main.jsx            # Entry point
```

## License

This project is open source and available under the [MIT License](LICENSE).
