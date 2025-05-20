"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useExpense } from "@/context/expense-context"
import { useSettings } from "@/context/settings-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  darkMode: z.boolean(),
  monthlyBudget: z.coerce.number().nonnegative("Budget must be non-negative"),
  useBudgetRule: z.boolean(),
  necessitiesPercentage: z.coerce.number().min(0, "Percentage must be non-negative").max(100, "Percentage cannot exceed 100"),
  wantsPercentage: z.coerce.number().min(0, "Percentage must be non-negative").max(100, "Percentage cannot exceed 100"),
  savingsPercentage: z.coerce.number().min(0, "Percentage must be non-negative").max(100, "Percentage cannot exceed 100"),
}).refine((data) => {
  const total = data.necessitiesPercentage + data.wantsPercentage + data.savingsPercentage;
  return total === 100;
}, {
  message: "Percentages must add up to 100%",
  path: ["necessitiesPercentage"],
});

const currencies = [
  { code: "PHP", name: "Philippine Peso" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
]

export function SettingsPage() {
  const { settings: expenseSettings, updateSettings: updateExpenseSettings } = useExpense()
  const { 
    currency, 
    monthlyBudget, 
    darkMode, 
    useBudgetRule, 
    necessitiesPercentage, 
    wantsPercentage, 
    savingsPercentage,
    setCurrency,
    setMonthlyBudget,
    setDarkMode,
    setUseBudgetRule,
    setNecessitiesPercentage,
    setWantsPercentage,
    setSavingsPercentage,
    saveSettings
  } = useSettings()
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency,
      darkMode,
      monthlyBudget,
      useBudgetRule,
      necessitiesPercentage,
      wantsPercentage,
      savingsPercentage
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // Update both context providers
      updateExpenseSettings({
        currency: values.currency,
        darkMode: values.darkMode,
        monthlyBudget: values.monthlyBudget
      })
      
      // Update settings context
      setCurrency(values.currency)
      setMonthlyBudget(values.monthlyBudget)
      setDarkMode(values.darkMode)
      setUseBudgetRule(values.useBudgetRule)
      setNecessitiesPercentage(values.necessitiesPercentage)
      setWantsPercentage(values.wantsPercentage)
      setSavingsPercentage(values.savingsPercentage)
      saveSettings()
    } catch (error) {
      console.error("Failed to update settings:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Customize your expense tracking experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Configure your preferences for the expense tracker</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the currency for displaying amounts</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="darkMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Dark Mode</FormLabel>
                      <FormDescription>Enable dark mode for the application</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Budget</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>Set your monthly budget limit for expense tracking</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator className="my-4" />
              <h3 className="text-lg font-medium">Budget Allocation Rule</h3>
              
              <FormField
                control={form.control}
                name="useBudgetRule"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Use 70-20-10 Budget Rule</FormLabel>
                      <FormDescription>Automatically allocate your budget into Necessities, Wants, and Savings</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {form.watch("useBudgetRule") && (
                <div className="space-y-4 rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="necessitiesPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Necessities Percentage</FormLabel>
                        <FormControl>
                          <Input type="number" step="1" min="0" max="100" placeholder="70" {...field} />
                        </FormControl>
                        <FormDescription>Percentage for essential expenses (food, bills, transport)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wantsPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wants Percentage</FormLabel>
                        <FormControl>
                          <Input type="number" step="1" min="0" max="100" placeholder="20" {...field} />
                        </FormControl>
                        <FormDescription>Percentage for discretionary spending (shopping, entertainment)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="savingsPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Savings Percentage</FormLabel>
                        <FormControl>
                          <Input type="number" step="1" min="0" max="100" placeholder="10" {...field} />
                        </FormControl>
                        <FormDescription>Percentage to save for future goals</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-sm text-muted-foreground">
                    Total: {form.watch("necessitiesPercentage") + form.watch("wantsPercentage") + form.watch("savingsPercentage")}% (must equal 100%)
                  </p>
                </div>
              )}
              
              <CardFooter className="flex justify-between px-0">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

