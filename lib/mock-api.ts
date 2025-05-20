import type { Expense, ExpenseCategory, BudgetCategory } from "@/context/expense-context"
import { format, subDays } from "date-fns"

// Generate dates for the past 3 months
const today = new Date()
const generatePastDate = (daysAgo: number) => format(subDays(today, daysAgo), "yyyy-MM-dd")

// Map expense categories to budget categories
const categoryToBudgetMap: Record<ExpenseCategory, BudgetCategory> = {
  Food: "Necessities",
  Transport: "Necessities",
  Bills: "Necessities",
  Health: "Necessities",
  Education: "Necessities",
  Shopping: "Wants",
  Entertainment: "Wants",
  Savings: "Savings",
  Other: "Wants"
}

// Sample data for mock API
const sampleExpenses: Expense[] = [
  {
    id: "exp1",
    amount: 2500,
    category: "Food",
    budgetCategory: "Necessities",
    description: "Grocery shopping",
    date: generatePastDate(5),
  },
  {
    id: "exp2",
    amount: 1400,
    category: "Transport",
    budgetCategory: "Necessities",
    description: "Grab ride",
    date: generatePastDate(7),
  },
  {
    id: "exp3",
    amount: 6000,
    category: "Bills",
    budgetCategory: "Necessities",
    description: "Electricity bill",
    date: generatePastDate(10),
  },
  {
    id: "exp4",
    amount: 4500,
    category: "Shopping",
    budgetCategory: "Wants",
    description: "New shirt",
    date: generatePastDate(15),
  },
  {
    id: "exp5",
    amount: 1800,
    category: "Entertainment",
    budgetCategory: "Wants",
    description: "Movie tickets",
    date: generatePastDate(20),
  },
  {
    id: "exp6",
    amount: 3500,
    category: "Health",
    budgetCategory: "Necessities",
    description: "Doctor's appointment",
    date: generatePastDate(25),
  },
  {
    id: "exp7",
    amount: 10000,
    category: "Education",
    budgetCategory: "Necessities",
    description: "Online course",
    date: generatePastDate(30),
  },
  {
    id: "exp8",
    amount: 750,
    category: "Other",
    budgetCategory: "Wants",
    description: "Donation",
    date: generatePastDate(35),
  },
  {
    id: "exp9",
    amount: 3200,
    category: "Food",
    budgetCategory: "Necessities",
    description: "Restaurant dinner",
    date: generatePastDate(40),
  },
  {
    id: "exp10",
    amount: 1200,
    category: "Transport",
    budgetCategory: "Necessities",
    description: "Taxi fare",
    date: generatePastDate(45),
  },
  {
    id: "exp11",
    amount: 5500,
    category: "Bills",
    budgetCategory: "Necessities",
    description: "Water bill",
    date: generatePastDate(50),
  },
  {
    id: "exp12",
    amount: 8000,
    category: "Shopping",
    budgetCategory: "Wants",
    description: "New shoes",
    date: generatePastDate(55),
  },
  {
    id: "exp13",
    amount: 2500,
    category: "Entertainment",
    budgetCategory: "Wants",
    description: "Concert tickets",
    date: generatePastDate(60),
  },
  {
    id: "exp14",
    amount: 1500,
    category: "Health",
    budgetCategory: "Necessities",
    description: "Medicine",
    date: generatePastDate(65),
  },
  {
    id: "exp15",
    amount: 7500,
    category: "Education",
    budgetCategory: "Necessities",
    description: "Books",
    date: generatePastDate(70),
  },
  {
    id: "exp16",
    amount: 1000,
    category: "Other",
    budgetCategory: "Wants",
    description: "Gift",
    date: generatePastDate(75),
  },
]

// Mock API functions
export const mockFetchExpenses = async (): Promise<Expense[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...sampleExpenses]
}

export const mockAddExpense = async (expense: Omit<Expense, "id" | "budgetCategory">): Promise<Expense> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  const budgetCategory = categoryToBudgetMap[expense.category]
  const newExpense = {
    ...expense,
    budgetCategory,
    id: Math.random().toString(36).substring(2, 9),
  }
  return newExpense
}

export const mockUpdateExpense = async (id: string, expense: Partial<Expense>): Promise<Expense> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  const existingExpense = sampleExpenses.find((e) => e.id === id)
  if (!existingExpense) {
    throw new Error("Expense not found")
  }
  
  // If category is updated, update the budget category too
  let budgetCategoryUpdate = {}
  if (expense.category) {
    budgetCategoryUpdate = {
      budgetCategory: categoryToBudgetMap[expense.category]
    }
  }
  
  return { ...existingExpense, ...expense, ...budgetCategoryUpdate }
}

export const mockDeleteExpense = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  // In a real API, this would delete the expense
}

export const categories: ExpenseCategory[] = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Savings",
  "Other",
]

export const categoryColors: Record<ExpenseCategory, string> = {
  Food: "#E31B64",
  Transport: "#0C56D0",
  Bills: "#DE9000",
  Shopping: "#008F76",
  Entertainment: "#7A1FA2",
  Health: "#DB5A00",
  Education: "#3A52B2",
  Savings: "#00A86B",
  Other: "#4B5563",
}

