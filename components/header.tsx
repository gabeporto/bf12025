"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { F1_THEME } from "@/lib/theme"
import { Flag, Trophy, Target, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      name: "Corridas",
      href: "/corridas",
      icon: Flag,
      disabled: false,
    },
    {
      name: "Classificação",
      href: "/classificacao",
      icon: Trophy,
      disabled: true,
    },
    {
      name: "Apostar",
      href: "/apostar",
      icon: Target,
      disabled: true,
    },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white shadow-sm"
      style={{
        background: `linear-gradient(90deg, ${F1_THEME.primary} 0%, #B30000 100%)`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Flag className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">BF1 2025</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  asChild
                  className={`
                    flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-md transition-colors
                    ${
                      isActive
                        ? "bg-white text-red-600 hover:bg-gray-100"
                        : "text-white hover:bg-white/10 hover:text-white"
                    }
                    ${item.disabled ? 'opacity-50 pointer-events-none' : 'opacity-100 cursor-pointer'}
                  `}
                >
                  <Link href={item.href}>
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm lg:text-base">{item.name}</span>
                  </Link>
                </Button>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/10"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/50 backdrop-blur-sm">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-md transition-colors mx-2
                      ${isActive ? "bg-white text-red-600" : "text-white hover:bg-white/10"}
                      ${item.disabled ? 'opacity-50 pointer-events-none' : 'opacity-100 cursor-pointer'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
