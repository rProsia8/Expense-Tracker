"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { BarChart3, CreditCard, Home, PlusCircle, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Add Expense",
    href: "/add",
    icon: PlusCircle,
  },
  {
    name: "Expense History",
    href: "/history",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen flex-col border-r bg-background">
      <motion.div 
        className="flex h-14 items-center border-b px-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <BarChart3 className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="text-foreground font-bold">Expense Tracker</span>
        </Link>
      </motion.div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="grid gap-1">
          {navItems.map((item, index) => (
            <motion.li 
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "relative w-full justify-start gap-2 transition-all duration-300", 
                    pathname === item.href && "font-medium"
                  )}
                  asChild
                >
                  <motion.div
                    whileHover={{ 
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {pathname === item.href && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-0 z-10 h-full w-1 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </motion.div>
                </Button>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
      <motion.div 
        className="border-t p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <ModeToggle />
      </motion.div>
    </div>
  )
}

