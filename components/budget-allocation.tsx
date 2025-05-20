"use client"

import { motion } from "framer-motion"
import { DollarSign, ShoppingBag, Wallet, PiggyBank, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { useExpense } from "@/context/expense-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function BudgetAllocation() {
  const router = useRouter()
  const { 
    settings, 
    expensesByBudgetCategory, 
    budgetCategoryAllocation, 
    budgetCategoryUtilization 
  } = useExpense()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: settings.currency,
    }).format(amount)
  }

  const handleAddSavings = () => {
    // Navigate to add expense page with savings pre-selected
    router.push("/add?category=Savings")
  }

  const categoryData = [
    {
      title: "Necessities (70%)",
      icon: ShoppingBag,
      color: "text-blue-500",
      progressColor: "bg-blue-600",
      allocation: budgetCategoryAllocation.necessities,
      spent: expensesByBudgetCategory.Necessities,
      remaining: budgetCategoryAllocation.necessities - expensesByBudgetCategory.Necessities,
      utilization: budgetCategoryUtilization.necessities,
      isSavings: false
    },
    {
      title: "Wants (20%)",
      icon: Wallet,
      color: "text-purple-500",
      progressColor: "bg-purple-600",
      allocation: budgetCategoryAllocation.wants,
      spent: expensesByBudgetCategory.Wants,
      remaining: budgetCategoryAllocation.wants - expensesByBudgetCategory.Wants,
      utilization: budgetCategoryUtilization.wants,
      isSavings: false
    },
    {
      title: "Savings (10%)",
      icon: PiggyBank,
      color: "text-green-500",
      progressColor: "bg-green-600",
      allocation: budgetCategoryAllocation.savings,
      spent: expensesByBudgetCategory.Savings,
      remaining: budgetCategoryAllocation.savings - expensesByBudgetCategory.Savings,
      utilization: budgetCategoryUtilization.savings,
      isSavings: true
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid gap-4 md:grid-cols-3"
    >
      {categoryData.map((category, index) => {
        const Icon = category.icon
        const isOverBudget = category.utilization > 100
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{category.title}</CardTitle>
                <Icon className={`h-4 w-4 ${category.color}`} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Allocated</span>
                    <span>{formatCurrency(category.allocation)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span>{formatCurrency(category.spent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className={isOverBudget ? "text-red-500" : "text-green-500"}>
                      {formatCurrency(category.remaining)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget Utilization</span>
                    <span className={isOverBudget ? "text-red-500 font-medium" : "font-medium"}>
                      {Math.min(Math.round(category.utilization), 999)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(category.utilization, 100)} 
                    className={`h-2 ${isOverBudget ? "bg-red-200 dark:bg-red-950" : "bg-gray-200 dark:bg-gray-800"}`}
                    indicatorClassName={isOverBudget ? "bg-red-600" : category.progressColor} 
                  />
                </div>
                
                {category.isSavings && (
                  <Button 
                    size="sm" 
                    className="w-full mt-2 bg-green-600 hover:bg-green-700"
                    onClick={handleAddSavings}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Savings
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
} 