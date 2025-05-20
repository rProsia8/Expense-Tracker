import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ExpenseProvider } from "@/context/expense-context"
import { Sidebar } from "@/components/sidebar"
import { AuthProvider } from "@/context/auth-context"
import { SettingsProvider } from "@/context/settings-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track, categorize, and analyze your expenses",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>Expense Tracker</title>
        <meta name="description" content="Track and manage your expenses" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>
            <SettingsProvider>
              <ExpenseProvider>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <main className="flex-1 p-4 md:p-6">{children}</main>
                </div>
              </ExpenseProvider>
              <Toaster />
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'