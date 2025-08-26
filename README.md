# RoadSurfer Booking Calendar

A modern React application for camper van booking management with an intuitive calendar interface and drag-and-drop rescheduling functionality.

## Live Demo

**[View Live Application](https://linda-formumm.github.io/camper-booking-calendar/)**

## About This Project

This project was built as an interview coding challenge to demonstrate modern React development practices. It implements a comprehensive booking calendar system with the following capabilities:

### Core Features
- Station selection with search functionality for camper pickup/return locations
- Weekly calendar view with intuitive navigation
- Native HTML5 drag-and-drop for booking rescheduling
- Real-time updates using global state management
- Fully responsive design that works on mobile and desktop
- Complete dark/light mode support with system preference detection

### Technical Implementation
- Built with React 19, TypeScript, and Vite for modern development
- Uses Zustand for predictable state management
- Includes 39 comprehensive unit tests
- Automated CI/CD pipeline with GitHub Actions
- Code quality enforced with ESLint, Prettier, and pre-commit hooks

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm package manager

### Installation and Setup
```bash
# Clone the repository
git clone https://github.com/linda-formumm/camper-booking-calendar.git
cd camper-booking-calendar

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Architecture Overview

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Calendar.tsx     # Main calendar with drag & drop
│   ├── StationPicker.tsx # Station search & selection
│   ├── BookingList.tsx   # Booking pills with drag handlers
│   └── ui/              # Base UI components
├── pages/              # Route components
│   ├── HomePage.tsx     # Landing page with station picker
│   └── BookingDetailPage.tsx # Individual booking details
├── store/              # Global state management
│   ├── appStore.ts      # UI state (selected station, week, etc.)
│   └── bookingStore.ts  # Booking data with CRUD operations
├── lib/                # Utilities and business logic
│   ├── date-utils.ts    # Date calculations and formatting
│   ├── api.ts          # Mock API layer
│   └── types.ts        # TypeScript type definitions
└── hooks/              # Custom React hooks
```

### State Management Approach
The application uses a dual-store architecture with Zustand:

- **AppStore**: Handles UI state like selected station, calendar week navigation, and dark mode preferences
- **BookingStore**: Manages booking data with optimistic updates for immediate user feedback
- **Clear Separation**: UI concerns are kept separate from business data for better maintainability
- **Performance Focused**: Store-based architecture minimizes unnecessary API calls

### Key Business Logic Decisions
- **Duration Calculation**: Implements proper rental day counting (pickup Monday, return Tuesday = 1 day)
- **Date Validation**: Prevents invalid booking date ranges during drag operations
- **Drag & Drop**: Uses native HTML5 implementation with visual feedback and validation
- **Data Loading**: Bookings are loaded once per station selection for optimal performance

## Testing Strategy

The project includes 39 comprehensive unit tests covering critical functionality:

### Date Utilities (31 tests)
These tests cover the core business logic:
- Duration calculation with correct rental day counting
- Week navigation and ISO week number calculations
- Date formatting and display functions
- Booking date range validation
- Edge cases including month boundaries, year transitions, and timezone handling

### Booking Store (8 tests)
These tests ensure state management reliability:
- Setting and retrieving booking data
- Optimistic booking updates
- CRUD operations consistency
- Store state isolation between test runs

You can run the full test suite with `npm test`

## Technical Decision Explanations

### Why Zustand over Context API?
Zustand was chosen for several practical reasons:
- Better performance by avoiding unnecessary component re-renders
- Simpler implementation with less boilerplate compared to Redux
- Excellent TypeScript support with automatic type inference
- Built-in development tools for debugging

### Why Native HTML5 Drag & Drop?
The decision to use native drag-and-drop came down to:
- Better accessibility with built-in keyboard navigation support
- Superior performance using browser-optimized implementations
- Reduced bundle size by avoiding external dependencies
- Better cross-device compatibility including mobile

### Why Store-Based Data Architecture?
This approach provides several benefits:
- Single source of truth for booking data consistency
- Improved performance by loading data once per station
- Better user experience through optimistic updates
- Cleaner code organization with clear separation of concerns

## CI/CD Pipeline

The project uses GitHub Actions for automated deployment:

1. **Install Dependencies** - Fresh install using npm ci
2. **Run Tests** - All 39 tests must pass before proceeding
3. **Build Application** - Creates optimized production build
4. **Deploy to GitHub Pages** - Automatic deployment on main branch updates

## Interview Discussion Points

### Challenges Addressed
During development, several technical challenges were solved:

1. **Global State Consistency**: Implemented a reliable system for keeping booking data synchronized across all components
2. **Intuitive Drag & Drop UX**: Created smooth rescheduling experience with proper validation and feedback
3. **Performance Optimization**: Reduced API calls through strategic data loading and caching
4. **Business Logic Accuracy**: Corrected rental duration calculations to match real-world expectations
5. **Scalable Architecture**: Designed clean separation between UI components and business logic

### Code Quality Measures
The project demonstrates several best practices:

- **TypeScript Integration**: Strict type checking prevents common runtime errors
- **Comprehensive Testing**: 39 unit tests ensure business logic correctness
- **Component Design**: Reusable components following single-responsibility principle
- **Predictable State**: Clear state management patterns using Zustand
- **Error Handling**: Graceful handling of edge cases and potential API failures

## Browser Compatibility

The application supports all modern browsers including Chrome, Firefox, Safari, and Edge. The responsive design works well on both mobile and desktop devices using a progressive enhancement approach.

## Contributing

If you'd like to contribute to this project:

1. Fork the repository
2. Create a feature branch for your changes
3. Make your modifications (pre-commit hooks will automatically run)
4. Add appropriate tests for any new functionality
5. Create a pull request with a clear description

## License

This project is available under the MIT License.
