# Expense Tracker Application

A full-stack expense tracking application with a modern React frontend and FastAPI backend. This application helps users track, categorize, and visualize their personal expenses.

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

### Technical Features
- **Modern UI**: Built with Next.js, React 19, and Tailwind CSS
- **Responsive Design**: Works well on mobile, tablet, and desktop devices
- **Interactive Charts**: Powered by Recharts
- **Animations**: Smooth transitions with Framer Motion
- **Type Safety**: Full TypeScript integration
- **REST API**: Backend built with FastAPI and SQLAlchemy
- **SQLite Database**: Local storage for expense data
- **JWT Authentication**: Secure user authentication

## Technologies Used

### Frontend
- **Next.js** - React framework for server-side rendering and static site generation
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Strongly typed programming language that builds on JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Component library built on top of Tailwind CSS
- **Framer Motion** - Animation library for React
- **React Hook Form** - Form validation library
- **Zod** - TypeScript-first schema validation
- **Recharts** - Composable charting library for React
- **Date-fns** - Modern JavaScript date utility library

### Backend
- **FastAPI** - Modern, fast web framework for building APIs with Python
- **SQLAlchemy** - SQL toolkit and Object-Relational Mapping (ORM) library
- **SQLite** - Lightweight disk-based database
- **Pydantic** - Data validation and settings management using Python type annotations
- **JWT** - JSON Web Tokens for secure authentication
- **Uvicorn** - ASGI server implementation for Python

## How It Works: Application Process Flow

### Authentication Flow
1. User registers a new account or logs in with existing credentials
2. Backend validates credentials and issues a JWT token
3. Frontend stores token in local storage and includes it in subsequent API requests
4. Protected routes check for valid token before rendering

### Expense Management Process
1. **Creation**:
   - User enters expense details (amount, category, description, date)
   - Frontend validates input using Zod schema
   - Data is sent to the backend API
   - Backend validates, processes, and stores the expense in the database
   - UI updates to reflect the new expense

2. **Retrieval & Display**:
   - On page load, application fetches expenses from the backend
   - Data is processed and grouped for different visualizations
   - Charts and tables are rendered with the processed data
   - Real-time filtering occurs as users adjust date ranges or categories

3. **Updates & Deletions**:
   - Edit dialog opens with pre-filled expense data
   - Changes are validated and sent to the backend
   - Optimistic UI updates show changes immediately
   - Confirmation is required for deletions to prevent accidental data loss

### Data Visualization Pipeline
1. Raw expense data is retrieved from the API
2. Data is processed and transformed for specific chart requirements
3. Date-based data is aggregated by day, week, or month as needed
4. Category-based data is grouped and calculated for percentage distribution
5. Charts render the processed data with interactive elements

### Budget Tracking Mechanism
1. User sets monthly budget in settings
2. Application calculates spending against budget in real-time
3. Visual indicators show budget utilization percentage
4. Warnings appear when spending approaches or exceeds budget limits

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- npm or pnpm


2. Install frontend dependencies
   npm install

3. Start the development server
   npm run dev
4. Open http://localhost:3000 in your browser

### Backend Setup
1. Navigate to the backend directory
   cd backend


2. Create a virtual environment (optional but recommended)
   ```
   python -m venv venv
   # Windows
   .\venv\Scripts\activate

3. Install Python dependencies
   pip install -r requirements.txt


4. Start the backend server
   uvicorn main:app --reload

The backend API will be available at http://localhost:8000. The application uses SQLite with SQLAlchemy ORM. The database file will be created automatically when you first run the application.

## Usage Guide

### Adding Expenses
1. Log in to your account
2. Navigate to the "Add Expense" page
3. Fill in the expense details:
   - Amount
   - Category
   - Description
   - Date
4. Click "Save" to record the expense

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

## Troubleshooting

### Common Issues
- **Backend connection errors**: Ensure the FastAPI server is running at http://localhost:8000
- **Authentication issues**: Check if your token has expired; try logging in again
- **Database errors**: If the database becomes corrupted, delete the `expense_tracker.db` file and restart the server
