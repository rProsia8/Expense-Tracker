"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useExpense, type ExpenseCategory } from "@/context/expense-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories } from "@/lib/mock-api"

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.enum([
    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ] as const),
  description: z.string().min(1, "Description is required"),
  date: z.string(),
})

interface EditExpenseDialogProps {
  expenseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditExpenseDialog({ expenseId, open, onOpenChange }: EditExpenseDialogProps) {
  const { expenses, updateExpense } = useExpense()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const expense = expenses.find((e) => e.id === expenseId)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      category: "Food" as ExpenseCategory,
      description: "",
      date: new Date().toISOString().split("T")[0],
    },
  })

  useEffect(() => {
    if (expense) {
      form.reset({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
      })
    }
  }, [expense, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!expense) return

    setIsSubmitting(true)
    try {
      await updateExpense(expenseId, values)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update expense:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!expense) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>Make changes to your expense here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Expense description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

