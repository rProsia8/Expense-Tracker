"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSettings } from "@/context/settings-context"

export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Bills"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Education"
  | "Savings"
  | "Other"

export type BudgetCategory = "Necessities" | "Wants" | "Savings"

export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  budgetCategory: BudgetCategory
  description: string
  date: string
}

export interface UserSettings {
  currency: string
  darkMode: boolean
  monthlyBudget: number
}

interface ExpenseContextType {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, "id" | "budgetCategory">) => Promise<void>
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  isLoading: boolean
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void
  totalExpenses: number
  remainingBudget: number
  expensesByCategory: Record<ExpenseCategory, number>
  expensesByBudgetCategory: Record<BudgetCategory, number>
  filterExpenses: (startDate?: string, endDate?: string, category?: ExpenseCategory, budgetCategory?: BudgetCategory) => Expense[]
  getBudgetCategoryForExpense: (category: ExpenseCategory) => BudgetCategory
  budgetCategoryAllocation: {
    necessities: number
    wants: number
    savings: number
  }
  budgetCategoryUtilization: {
    necessities: number
    wants: number
    savings: number
  }
}

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

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [settings, setSettings] = useState<UserSettings>({
    currency: "PHP",
    darkMode: false,
    monthlyBudget: 2000,
  })
  
  const { getBudgetAllocations } = useSettings()

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const getBudgetCategoryForExpense = (category: ExpenseCategory): BudgetCategory => {
    return categoryToBudgetMap[category]
  }

  const addExpense = async (expense: Omit<Expense, "id" | "budgetCategory">) => {
    setIsLoading(true)
    try {
      // Mock API call
      const budgetCategory = getBudgetCategoryForExpense(expense.category)
      const newExpense = {
        ...expense,
        budgetCategory,
        id: Math.random().toString(36).substring(2, 9),
      }
      setExpenses((prev) => [newExpense, ...prev])
      showNotification("Expense added successfully")
    } catch (error) {
      console.error("Failed to add expense:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateExpense = async (id: string, updatedExpense: Partial<Expense>) => {
    setIsLoading(true)
    try {
      // If category is updated, we need to update budget category too
      let budgetCategoryUpdate = {}
      if (updatedExpense.category) {
        budgetCategoryUpdate = {
          budgetCategory: getBudgetCategoryForExpense(updatedExpense.category)
        }
      }
      
      // Mock API call
      setExpenses((prev) => prev.map((expense) => 
        expense.id === id 
          ? { ...expense, ...updatedExpense, ...budgetCategoryUpdate } 
          : expense
      ))
      showNotification("Expense updated successfully")
    } catch (error) {
      console.error("Failed to update expense:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteExpense = async (id: string) => {
    setIsLoading(true)
    try {
      // Mock API call
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
      showNotification("Expense deleted successfully")
    } catch (error) {
      console.error("Failed to delete expense:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    showNotification("Settings updated successfully")
  }

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate remaining budget
  const remainingBudget = settings.monthlyBudget - totalExpenses

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<ExpenseCategory, number>,
  )
  
  // Calculate expenses by budget category
  const expensesByBudgetCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.budgetCategory] = (acc[expense.budgetCategory] || 0) + expense.amount
      return acc
    },
    { Necessities: 0, Wants: 0, Savings: 0 } as Record<BudgetCategory, number>,
  )
  
  // Budget allocation based on the 70-20-10 rule
  const budgetCategoryAllocation = getBudgetAllocations()
  
  // Budget utilization by category
  const budgetCategoryUtilization = {
    necessities: expensesByBudgetCategory.Necessities / budgetCategoryAllocation.necessities * 100,
    wants: expensesByBudgetCategory.Wants / budgetCategoryAllocation.wants * 100,
    savings: expensesByBudgetCategory.Savings / budgetCategoryAllocation.savings * 100
  }

  // Filter expenses by date range and category
  const filterExpenses = (startDate?: string, endDate?: string, category?: ExpenseCategory, budgetCategory?: BudgetCategory) => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      const isAfterStart = startDate ? expenseDate >= new Date(startDate) : true
      const isBeforeEnd = endDate ? expenseDate <= new Date(endDate) : true
      const isCategory = category ? expense.category === category : true
      const isBudgetCategory = budgetCategory ? expense.budgetCategory === budgetCategory : true

      return isAfterStart && isBeforeEnd && isCategory && isBudgetCategory
    })
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        isLoading,
        settings,
        updateSettings,
        totalExpenses,
        remainingBudget,
        expensesByCategory,
        expensesByBudgetCategory,
        filterExpenses,
        getBudgetCategoryForExpense,
        budgetCategoryAllocation,
        budgetCategoryUtilization
      }}
    >
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Alert>
              <AlertTitle>Notification</AlertTitle>
              <AlertDescription>{notification}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </ExpenseContext.Provider>
  )
}

export function useExpense() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider")
  }
  return context
}

