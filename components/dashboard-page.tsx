"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, DollarSign, TrendingDown, TrendingUp, PiggyBank } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useRouter } from "next/navigation"

import { useExpense } from "@/context/expense-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseChart } from "@/components/expense-chart"
import { ExpenseTimeChart } from "@/components/expense-time-chart"
import { ExpenseCategoryChart } from "@/components/expense-category-chart"
import { ExpenseComparisonChart } from "@/components/expense-comparison-chart"
import { RecentExpenses } from "@/components/recent-expenses"
import { DateRangePicker } from "@/components/date-range-picker"
import { BudgetAllocation } from "@/components/budget-allocation"
import { Button } from "@/components/ui/button"

export function DashboardPage() {
  const { totalExpenses, remainingBudget, settings, expenses } = useExpense()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const router = useRouter()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: settings.currency,
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your expenses</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-green-600 hover:bg-green-700 text-white border-0"
            onClick={() => router.push("/add?category=Savings")}
          >
            <PiggyBank className="mr-1 h-4 w-4" /> Record Savings
          </Button>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">For the selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            {remainingBudget >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget < 0 ? "text-red-500" : ""}`}>
              {formatCurrency(remainingBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {formatCurrency(settings.monthlyBudget)} monthly budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Daily Expense</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(expenses.length > 0 ? totalExpenses / expenses.length : 0)}</div>
            <p className="text-xs text-muted-foreground">Based on {expenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {settings.monthlyBudget > 0
                ? `${Math.min(100, Math.round((totalExpenses / settings.monthlyBudget) * 100))}%`
                : "0%"}
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-2 rounded-full ${totalExpenses > settings.monthlyBudget ? "bg-red-500" : "bg-green-500"}`}
                style={{
                  width: `${Math.min(100, (totalExpenses / settings.monthlyBudget) * 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation (70-20-10 Rule)</CardTitle>
          <CardDescription>Your budget is automatically allocated using the 70-20-10 rule</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetAllocation />
        </CardContent>
      </Card>

      <Tabs defaultValue="pie" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="pie" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
              <CardDescription>Visual representation of your spending by category</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ExpenseChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Expense Distribution</CardTitle>
              <CardDescription>Compare spending across different categories</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ExpenseCategoryChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trends Over Time</CardTitle>
              <CardDescription>Track how your spending changes over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ExpenseTimeChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs. Actual Spending</CardTitle>
              <CardDescription>Compare your actual spending against your budget</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ExpenseComparisonChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentExpenses />
        </CardContent>
      </Card>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          Made with <span className="text-red-500">❤️</span> by Roy
        </p>
      </footer>
    </motion.div>
  )
}

