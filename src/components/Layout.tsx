import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun, Calendar, MapPin } from "lucide-react";
import { StationPicker } from "./StationPicker";
import { useAppStore } from "../store/appStore";

export default function Layout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const { selectedStation } = useAppStore();

  useEffect(() => {
    // Official Tailwind CSS best practice for dark mode detection
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldBeDark =
      storedTheme === "dark" || (!storedTheme && prefersDark);
    setIsDark(shouldBeDark);

    // Apply dark class to html element (Tailwind CSS official approach)
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-2 text-xl font-bold text-gray-700 dark:text-gray-300"
              >
                <Calendar size={24} />
                <span>Camper Booking</span>
              </Link>

              <nav className="hidden items-center space-x-6 md:flex">
                {/* Station Picker - always visible */}
                <div className="w-64">
                  <StationPicker />
                </div>

                {/* Navigation links - only visible when station is selected */}
                {selectedStation && (
                  <>
                    <Link
                      to="/calendar"
                      className={`flex items-center space-x-1 rounded-lg px-3 py-2 transition-colors ${
                        location.pathname === "/calendar"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      }`}
                    >
                      <Calendar size={16} />
                      <span>Calendar</span>
                    </Link>

                    <Link
                      to="/booking/example"
                      className={`flex items-center space-x-1 rounded-lg px-3 py-2 transition-colors ${
                        location.pathname.startsWith("/booking")
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      <MapPin size={16} />
                      <span>Sample Detail</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Theme Toggle only */}
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span className="hidden sm:inline">
                  {isDark ? "Light" : "Dark"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-gray-50 py-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>
            &copy; 2025 Camper Booking Calendar - Built with React, TypeScript &
            Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}
