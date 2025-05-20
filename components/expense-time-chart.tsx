"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"

import { useExpense } from "@/context/expense-context"

interface DailyExpense {
  date: string
  amount: number
}

export function ExpenseTimeChart() {
  const { expenses, settings } = useExpense()
  const [chartData, setChartData] = useState<DailyExpense[]>([])

  useEffect(() => {
    if (expenses.length === 0) return

    // Sort expenses by date
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Get the first and last date from expenses
    const firstDate = parseISO(sortedExpenses[0].date)
    const lastDate = parseISO(sortedExpenses[sortedExpenses.length - 1].date)

    // Create a range of dates from start of month of first expense to end of month of last expense
    const startDate = startOfMonth(firstDate)
    const endDate = endOfMonth(lastDate)

    // Generate all days in the range
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    // Create data for each day
    const dailyData = days.map((day) => {
      // Sum expenses for this day
      const dayExpenses = expenses.filter((expense) => isSameDay(parseISO(expense.date), day))
      const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        date: format(day, "MMM dd"),
        amount: totalAmount,
      }
    })

    setChartData(dailyData)
  }, [expenses])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: settings.currency,
    }).format(value)
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full relative overflow-hidden rounded-lg p-2"
      whileHover={{ 
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        scale: 1.01,
        transition: { duration: 0.3 }
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: 'currentColor' }} 
            interval="preserveStartEnd" 
            tickLine={{ stroke: 'currentColor' }}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value).split(".")[0]} 
            tick={{ fontSize: 12, fill: 'currentColor' }}
            tickLine={{ stroke: 'currentColor' }}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), "Amount"]}
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              borderRadius: '4px',
              color: 'white',
              border: 'none', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
            }}
          />
          <Legend formatter={(value) => <span className="text-foreground font-medium">{value}</span>} />
          <Line
            type="monotone"
            dataKey="amount"
            name="Daily Expenses"
            stroke="#0C56D0"
            strokeWidth={2.5}
            dot={{ fill: '#0C56D0', strokeWidth: 1, r: 4, stroke: '#fff' }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            animationBegin={0}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

