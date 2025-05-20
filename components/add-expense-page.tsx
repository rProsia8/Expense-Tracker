"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useExpense, type ExpenseCategory } from "@/context/expense-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { categories } from "@/lib/mock-api"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Wallet, PiggyBank } from "lucide-react"

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
    "Savings",
    "Other",
  ] as const),
  description: z.string().min(1, "Description is required"),
  date: z.string(),
})

export function AddExpensePage() {
  const { addExpense, settings, getBudgetCategoryForExpense } = useExpense()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentBudgetCategory, setCurrentBudgetCategory] = useState("")
  
  // Get the category from URL if it exists
  const categoryFromURL = searchParams.get('category') as ExpenseCategory | null
  const defaultCategory = categoryFromURL || "Food"
  
  // Description hint for savings
  const getDefaultDescription = (category: ExpenseCategory) => {
    if (category === "Savings") {
      return "Monthly savings deposit"
    }
    return ""
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      category: defaultCategory,
      description: getDefaultDescription(defaultCategory),
      date: new Date().toISOString().split("T")[0],
    },
  })
  
  // Update budget category whenever expense category changes
  useEffect(() => {
    const category = form.watch("category") as ExpenseCategory
    if (category) {
      setCurrentBudgetCategory(getBudgetCategoryForExpense(category))
      
      // If changing to Savings, update the description if it's empty
      if (category === "Savings" && !form.getValues("description")) {
        form.setValue("description", getDefaultDescription("Savings"))
      }
    }
  }, [form.watch("category"), getBudgetCategoryForExpense, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await addExpense(values)
      form.reset({
        amount: 0,
        category: "Food",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
      router.push("/")
    } catch (error) {
      console.error("Failed to add expense:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Render budget category badge
  const renderBudgetCategoryBadge = () => {
    let icon = null
    let colorClass = ""
    
    switch (currentBudgetCategory) {
      case "Necessities":
        icon = <ShoppingBag className="h-3 w-3 mr-1" />
        colorClass = "bg-blue-600 hover:bg-blue-700"
        break
      case "Wants":
        icon = <Wallet className="h-3 w-3 mr-1" />
        colorClass = "bg-purple-600 hover:bg-purple-700"
        break
      case "Savings":
        icon = <PiggyBank className="h-3 w-3 mr-1" />
        colorClass = "bg-green-600 hover:bg-green-700"
        break
    }
    
    return (
      <Badge className={`${colorClass} text-white font-medium flex items-center`}>
        {icon} {currentBudgetCategory}
      </Badge>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {categoryFromURL === "Savings" ? "Add Savings" : "Add Expense"}
        </h1>
        <p className="text-muted-foreground">
          {categoryFromURL === "Savings" 
            ? "Record a savings deposit to track your progress" 
            : "Record a new expense to track your spending"
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {categoryFromURL === "Savings" ? "New Savings Entry" : "New Expense"}
          </CardTitle>
          <CardDescription>
            {categoryFromURL === "Savings" 
              ? "Fill in the details of your savings deposit" 
              : "Fill in the details of your expense"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ({settings.currency})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>
                      {categoryFromURL === "Savings" 
                        ? "Enter the amount you're saving" 
                        : "Enter the amount spent"
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Category</FormLabel>
                      {currentBudgetCategory && renderBudgetCategoryBadge()}
                    </div>
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
                    <FormDescription>
                      Select the category that best describes this expense. 
                      It will be automatically assigned to {currentBudgetCategory}.
                    </FormDescription>
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
                      <Textarea 
                        placeholder={
                          categoryFromURL === "Savings" 
                            ? "What are you saving for?" 
                            : "What was this expense for?"
                        } 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {categoryFromURL === "Savings" 
                        ? "Provide details about your savings goal" 
                        : "Provide a brief description of the expense"
                      }
                    </FormDescription>
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
                    <FormDescription>
                      {categoryFromURL === "Savings" 
                        ? "When did you make this deposit?" 
                        : "When did you make this expense?"
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="flex justify-between px-0">
                <Button type="button" variant="outline" onClick={() => router.push("/")}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={categoryFromURL === "Savings" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {isSubmitting 
                    ? (categoryFromURL === "Savings" ? "Saving..." : "Adding...") 
                    : (categoryFromURL === "Savings" ? "Add Savings" : "Add Expense")
                  }
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

