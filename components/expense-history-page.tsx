"use client"

import { useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Edit2, Search, Trash2 } from "lucide-react"

import { useExpense, type ExpenseCategory } from "@/context/expense-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditExpenseDialog } from "@/components/edit-expense-dialog"
import { DateRangePicker } from "@/components/date-range-picker"
import { categories } from "@/lib/mock-api"

export function ExpenseHistoryPage() {
  const { expenses, deleteExpense, settings } = useExpense()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | "">("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  }>({ key: "date", direction: "descending" })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editExpense, setEditExpense] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: settings.currency,
    }).format(amount)
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteExpense(deleteId)
      setDeleteId(null)
    }
  }

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  // Filter and sort expenses
  let filteredExpenses = [...expenses]

  // Apply date range filter
  if (dateRange.from) {
    filteredExpenses = filteredExpenses.filter((expense) => new Date(expense.date) >= dateRange.from!)
  }
  if (dateRange.to) {
    filteredExpenses = filteredExpenses.filter((expense) => new Date(expense.date) <= dateRange.to!)
  }

  // Apply category filter
  if (selectedCategory) {
    filteredExpenses = filteredExpenses.filter((expense) => expense.category === selectedCategory)
  }

  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.description.toLowerCase().includes(term) || expense.category.toLowerCase().includes(term),
    )
  }

  // Apply sorting
  filteredExpenses.sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "ascending"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (sortConfig.key === "amount") {
      return sortConfig.direction === "ascending" ? a.amount - b.amount : b.amount - a.amount
    }
    if (sortConfig.key === "category") {
      return sortConfig.direction === "ascending"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category)
    }
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense History</h1>
          <p className="text-muted-foreground">View and manage your past expenses</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ExpenseCategory | "")}>
          <SelectTrigger className="h-9 w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} className="w-full md:w-auto" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                Date {sortConfig.key === "date" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                Category {sortConfig.key === "category" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => handleSort("amount")}>
                Amount {sortConfig.key === "amount" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No expenses found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{format(new Date(expense.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <span className="rounded-full px-2 py-1 text-xs font-medium">{expense.category}</span>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditExpense(expense.id)}>
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(expense.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editExpense && (
        <EditExpenseDialog
          expenseId={editExpense}
          open={!!editExpense}
          onOpenChange={(open) => !open && setEditExpense(null)}
        />
      )}
    </motion.div>
  )
}

