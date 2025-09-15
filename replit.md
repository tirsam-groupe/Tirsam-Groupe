# TirSam - Truck Booking Application

## Overview

TirSam is a web application for booking commercial trucks in Algeria. The application allows users to reserve trucks by filling out a comprehensive form with personal information, business details, and truck preferences. It supports bilingual content (French and Arabic) and includes specialized validation for different business types (merchants, artisans, and farmers/breeders).

The application features a modern, responsive design with a landing page showcasing available truck models (3.5-ton and 6-ton vehicles) and a booking form that captures detailed customer information including registration numbers based on business type.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: React Hook Form for form handling with Zod schema validation
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON request/response format
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Validation**: Shared Zod schemas between frontend and backend for type safety

### Form Validation & Business Logic
- **Conditional Validation**: Registration number requirements based on business type
- **Duplicate Prevention**: Email and phone combination checking
- **Bilingual Support**: Form labels and validation messages in French with Arabic translations
- **Business Types**: Support for three categories (commercant, artisan, fellah) with specific registration requirements

### Development Environment
- **Hot Module Replacement**: Vite development server with fast refresh
- **Error Handling**: Runtime error overlay for development
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Build Process**: Optimized production builds with code splitting

### Data Schema
- **Booking Entity**: Comprehensive customer information including personal details, location (wilaya/commune), business type, registration numbers, and truck model preferences
- **Type Safety**: Shared TypeScript types between client and server
- **Validation**: Zod schemas for runtime validation and type inference

## External Dependencies

### Database & ORM
- **Drizzle ORM**: PostgreSQL integration with schema management and migrations
- **Neon Database**: Serverless PostgreSQL database provider
- **Connection**: Environment-based database URL configuration

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled React components including dialogs, forms, navigation, and data display components
- **Lucide Icons**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs

### Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for forms and API requests
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Development Tools
- **Replit Integration**: Custom Vite plugins for development environment including cartographer and dev banner
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **ESBuild**: Fast JavaScript bundler for production builds

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **CSS Variables**: Dynamic theming system supporting light/dark modes
- **Custom Fonts**: Google Fonts integration (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)

### Utilities
- **clsx & tailwind-merge**: Conditional CSS class management
- **date-fns**: Date manipulation and formatting
- **nanoid**: URL-safe unique string generator
- **wouter**: Minimalist router for React applications