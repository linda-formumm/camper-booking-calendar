# Camper Booking Calendar

A modern React application for camper booking with calendar interface.

## 🚀 Features

- **Modern React Stack**: React 19 + TypeScript + Vite
- **State Management**: TanStack Query + Zustand
- **UI/UX**: Tailwind CSS v4 with Dark Mode
- **Routing**: React Router DOM v7
- **Code Quality**: ESLint + Prettier + Vitest
- **Automation**: Husky Pre-Commit Hooks
- **Deployment**: GitHub Pages with Actions

## 🛠 Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Format code
npm run format

# Run linting
npm run lint

# Create build
npm run build
```

### Code Quality

- **Pre-Commit Hooks**: Automatic formatting and linting
- **Testing**: Vitest + React Testing Library
- **Type Safety**: Strict TypeScript configuration

## 🚦 Deployment

### GitHub Pages

The app is automatically deployed to GitHub Pages on push to `main`:

1. **Build Pipeline**: Lint → Test → Build
2. **Deployment**: Automatic deployment to GitHub Pages
3. **URL**: `https://[username].github.io/camper-booking-calendar/`

### SPA Routing

- **404 Fallback**: Configured for client-side routing
- **Base Path**: Automatic adjustment for GitHub Pages

## 📁 Project Structure

```
src/
├── components/         # Reusable components
│   └── Layout.tsx     # App shell with navigation
├── pages/             # Page components
│   ├── CalendarPage.tsx
│   └── BookingDetailPage.tsx
├── providers/         # Context providers
│   └── QueryProvider.tsx
├── store/            # Zustand store
│   └── appStore.ts
├── styles/           # Global styles
│   └── tailwind.css
├── App.tsx           # Root component
└── AppRouter.tsx     # Routing configuration
```

## 🎨 Tech Stack

- **Frontend**: React 19.1.1 + TypeScript 5.8.3
- **Build Tool**: Vite 7.1.3
- **Styling**: Tailwind CSS v4.1.12
- **State**: TanStack Query 5.85.5 + Zustand 5.0.8
- **Routing**: React Router DOM 7.8.1
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions + Husky

## 🌙 Dark Mode

Complete dark mode support with:

- System preference detection
- localStorage persistence
- FOUC prevention
- Tailwind v4 @custom-variant syntax

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Build preview
npm run test         # Run tests
npm run test:ui      # Test UI
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier formatting
npm run type-check   # TypeScript check
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes (pre-commit hooks run automatically)
4. Create pull request

## 📄 License

MIT License
