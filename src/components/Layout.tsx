import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Moon, Sun, Calendar, MapPin } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check system preference and localStorage
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = storedTheme === 'dark' || (!storedTheme && prefersDark)
    setIsDark(shouldBeDark)
    
    // Apply theme class to document
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    
    setIsDark(newIsDark)
    
    // Debug: Log the current state
    console.log('Toggle Theme:', { 
      currentIsDark: isDark, 
      newIsDark, 
      documentClassList: Array.from(document.documentElement.classList) 
    })
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    // Debug: Log after change
    console.log('After toggle:', Array.from(document.documentElement.classList))
  }

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Debug Dark Mode Test */}
      <div className="p-4 text-center border-b border-default" style={{
        backgroundColor: document.documentElement.classList.contains('dark') ? 'var(--color-surface-dark)' : 'var(--color-surface)',
        color: document.documentElement.classList.contains('dark') ? 'var(--color-text-primary-dark)' : 'var(--color-text-primary)'
      }}>
        <strong>Dark Mode Test:</strong> {isDark ? 'DARK MODE ACTIVE' : 'LIGHT MODE ACTIVE'} | 
        HTML Classes: {typeof document !== 'undefined' ? Array.from(document.documentElement.classList).join(', ') : 'SSR'}
      </div>
      
      {/* Header */}
      <header className="bg-surface border-b border-default shadow-sm"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)'
              }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-xl font-bold" 
                    style={{ color: 'var(--color-primary)' }}>
                <Calendar size={24} />
                <span>Camper Booking</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Calendar size={16} />
                  <span>Kalender</span>
                </Link>
                
                <Link 
                  to="/booking/example" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/booking') 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <MapPin size={16} />
                  <span>Beispiel Detail</span>
                </Link>
              </nav>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">
                {isDark ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Camper Booking Calendar - Built with React, TypeScript & Tailwind CSS v4</p>
        </div>
      </footer>
    </div>
  )
}
