"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { motion } from "framer-motion"

import { useExpense, type ExpenseCategory } from "@/context/expense-context"
import { categoryColors } from "@/lib/mock-api"

export function ExpenseCategoryChart() {
  const { expensesByCategory, settings } = useExpense()
  const [chartData, setChartData] = useState<{ name: string; amount: number }[]>([])

  useEffect(() => {
    const data = Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      amount: amount,
    }))
    // Sort by amount descending
    data.sort((a, b) => b.amount - a.amount)
    setChartData(data)
  }, [expensesByCategory])

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
        <BarChart
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
            dataKey="name" 
            tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 500 }}
            tickLine={{ stroke: 'currentColor' }}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value).split(".")[0]} 
            tick={{ fill: 'currentColor', fontSize: 12 }}
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
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Legend 
            formatter={(value) => <span className="text-foreground font-medium">{value}</span>}
          />
          <Bar 
            dataKey="amount" 
            name="Expense Amount" 
            fill="#8884d8" 
            animationBegin={0} 
            animationDuration={800}
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={categoryColors[entry.name as ExpenseCategory] || "#000000"} 
                stroke="#000"
                strokeWidth={0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

