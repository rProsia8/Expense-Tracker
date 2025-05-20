"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit2, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { useExpense } from "@/context/expense-context"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import { categoryColors } from "@/lib/mock-api"

export function RecentExpenses() {
  const { expenses, deleteExpense, settings } = useExpense()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editExpense, setEditExpense] = useState<string | null>(null)

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

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  if (recentExpenses.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground">No expenses recorded yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {recentExpenses.map((expense) => (
                <motion.tr
                  key={expense.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b transition-all duration-300 ease-in-out hover:bg-muted/50 hover:shadow-sm hover:shadow-primary/5 hover:scale-[1.01] data-[state=selected]:bg-muted"
                >
                  <TableCell className="font-medium">{format(new Date(expense.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <span 
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium text-white",
                        `bg-opacity-90 shadow-sm`
                      )}
                      style={{ backgroundColor: categoryColors[expense.category] }}
                    >
                      {expense.category}
                    </span>
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
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

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
    </>
  )
}

