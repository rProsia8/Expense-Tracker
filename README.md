# Expense Tracker Application

This application helps users track, categorize, and visualize their personal expenses.

## Features

### User Features
- **User Authentication**: Register new accounts and login securely
- **Expense Management**: Add, edit, and delete expense records
- **Categorization**: Organize expenses by customizable categories
- **Budget Tracking**: Set monthly budgets and monitor spending against them
- **Data Visualization**: View spending patterns through various chart types:
  - Pie charts for expense breakdown by category
  - Bar charts for category distribution
  - Line charts for expense trends over time
  - Comparison charts for budget vs. actual spending
- **Recent Transactions**: Quickly review latest expenses
- **Date Filtering**: Filter expenses by date ranges
- **Dark Mode**: Always-on dark mode for better visual comfort


## How It Works: Application Process Flow

### Authentication Flow
1. User registers a new account or logs in with existing credentials
2. Backend validates credentials and issues a JWT token
3. Frontend stores token in local storage and includes it in subsequent API requests
4. Protected routes check for valid token before rendering

### Budget Tracking Mechanism
1. User sets monthly budget in settings
2. Application calculates spending against budget in real-time
3. Visual indicators show budget utilization percentage
4. Warnings appear when spending approaches or exceeds budget limits

## Usage Guide

### Adding Expenses
1. Navigate to the "Add Expense" page
2. Fill in the expense details:
   - Amount
   - Category
   - Description
   - Date
3. Click "Save" to record the expense

### Viewing Statistics
The dashboard provides various visualizations:
- **Total Expenses**: Sum of all recorded expenses
- **Remaining Budget**: Difference between monthly budget and expenses
- **Average Daily Expense**: Average spending per transaction
- **Budget Utilization**: Percentage of monthly budget used

Charts are interactive and provide tooltips with detailed information.

### Managing Expenses
From the "Recent Transactions" section:
- Click the edit icon to modify an expense
- Click the delete icon to remove an expense

## Customization

### Currency Settings
You can change your preferred currency in the settings page.

### Monthly Budget
Adjust your monthly budget in the settings to better track your spending goals.
