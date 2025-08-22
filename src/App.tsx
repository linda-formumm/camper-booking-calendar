import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)
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
    const newTheme = isDark ? 'light' : 'dark'
    const newIsDark = !isDark
    
    console.log('Toggle ausgelöst:', { from: isDark ? 'dark' : 'light', to: newTheme })
    
    setIsDark(newIsDark)
    
    // Update document class
    document.documentElement.classList.toggle('dark', newIsDark)
    
    console.log('HTML Klassen nach Toggle:', document.documentElement.className)
    console.log('Enthält dark Klasse:', document.documentElement.classList.contains('dark'))
    
    // Persist in localStorage
    localStorage.setItem('theme', newTheme)
    
    // Force re-render durch State-Update
    setTimeout(() => {
      console.log('State nach Toggle:', { isDark: newIsDark })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      {/* Status Indikator */}
      <div className="fixed top-4 right-4 px-3 py-1 bg-red-500 dark:bg-green-500 text-white rounded-lg text-sm z-50">
        {isDark ? '🌙 Dark' : '☀️ Light'}
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Camper Booking Calendar
          </h1>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>

        {/* Test ob Tailwind funktioniert */}
        <div className="bg-red-500 text-white p-4 mb-4 rounded-lg">
          🚨 TAILWIND TEST: Diese Box sollte rot sein!
        </div>

        {/* Styling Methoden Demo */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">🎨 Dark Mode Styling Methoden</h2>
          
          {/* Methode 1: Tailwind Utility Classes (Empfohlen) */}
          <section className="card-custom">
            <h3 className="text-xl font-semibold mb-4">1. Tailwind Utility Classes</h3>
            <div className="space-y-4">
              {/* Background & Text */}
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p>Background: <code>bg-white dark:bg-gray-800</code></p>
                <p>Text: <code>text-gray-900 dark:text-white</code></p>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-4 flex-wrap">
                <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Primary Button
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors">
                  Secondary Button
                </button>
                <button className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors">
                  Outline Button
                </button>
              </div>
            </div>
          </section>

          {/* Methode 2: CSS Custom Properties */}
          <section className="card-custom">
            <h3 className="text-xl font-semibold mb-4">2. CSS Custom Properties</h3>
            <div className="space-y-4">
              <p className="text-muted">Diese Sektion nutzt CSS Variables für konsistente Theming.</p>
              <button className="custom-button">Custom CSS Button</button>
              <input 
                type="text" 
                className="input-field w-full" 
                placeholder="Input mit Custom Properties..."
              />
            </div>
          </section>

          {/* Methode 3: Kombiniert - Tailwind + Custom CSS */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">3. Kombinierte Ansätze</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cards mit verschiedenen Styles */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg dark:shadow-gray-900/30 border-l-4 border-blue-500 dark:border-blue-400">
                <h4 className="font-semibold text-gray-900 dark:text-white">Accent Border</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Mit border-l-4 Akzent</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Gradient Card</h4>
                <p className="text-green-700 dark:text-green-200 text-sm">Mit Gradient-Hintergrund</p>
              </div>
            </div>
          </section>

          {/* Methode 4: Conditional Styling basierend auf State */}
          <section className="card-custom">
            <h3 className="text-xl font-semibold mb-4">4. Conditional Styling (JavaScript)</h3>
            <div 
              className={`p-4 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-purple-900 text-purple-100 border-2 border-purple-700' 
                  : 'bg-yellow-100 text-yellow-900 border-2 border-yellow-300'
              }`}
            >
              <p>Diese Box ändert Farben basierend auf JavaScript State:</p>
              <p><strong>Light:</strong> Gelb | <strong>Dark:</strong> Lila</p>
              <p>Aktueller Modus: <span className="font-bold">{isDark ? 'DARK' : 'LIGHT'}</span></p>
            </div>
          </section>
        </div>

        {/* Original Test Box bleibt */}
        <div className="dark-mode-test mb-8">
          <h2 className="text-xl font-bold mb-2">🚨 DARK MODE TEST</h2>
          <p>Diese Box ist ROT im Light Mode und GRÜN im Dark Mode</p>
          <p>Aktueller Zustand: {isDark ? 'DARK' : 'LIGHT'}</p>
          <p>HTML hat 'dark' Klasse: {document.documentElement.classList.contains('dark') ? 'JA' : 'NEIN'}</p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Tailwind Styling
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tailwind CSS v4.1 sollte jetzt funktionieren.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-colors">
              Primary Button
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Dark Mode Test
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dark Mode sollte durch den Toggle funktionieren.
            </p>
            <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-xl transition-colors">
              Secondary Button
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Counter: {count}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Test der Interaktivität
            </p>
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Count +1
            </button>
          </div>
        </div>

        {/* Color Test */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Color & Design Test
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Blue</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-xl mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Green</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-xl mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Purple</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-xl mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Orange</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
