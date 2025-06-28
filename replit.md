# Portfolio Application

## Overview

This is a full-stack portfolio application built with React, TypeScript, Express.js, and PostgreSQL. The application provides both a public portfolio view and an admin panel for content management. It uses modern web development practices with server-side rendering capabilities and a comprehensive UI component library.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth animations and transitions
- **Theme Support**: Built-in dark/light mode with system preference detection

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Session-based authentication with bcrypt for password hashing
- **API Design**: RESTful API structure with proper error handling middleware

### Data Storage Solutions
- **Primary Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM for type-safe database queries and migrations
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Schema Management**: Centralized schema definitions in shared directory

## Key Components

### Database Schema
The application uses a comprehensive schema with the following main entities:
- **Users**: Authentication and user management
- **Profile**: Personal information and social links
- **Skills**: Technical skills with categories and proficiency levels
- **Experiences**: Work experience with technologies and descriptions
- **Projects**: Portfolio projects with links and tech stacks
- **Education**: Educational background
- **Activities**: Community involvement and speaking engagements
- **Contacts**: Contact form submissions
- **Sessions**: User session management

### Authentication & Authorization
- **Login System**: Username/password authentication with JWT-like token system
- **Session Management**: Server-side session storage with automatic cleanup
- **Protected Routes**: Admin panel protection with middleware authentication
- **Password Security**: bcrypt hashing for secure password storage

### Admin Panel
- **Content Management**: Full CRUD operations for all portfolio sections
- **Real-time Updates**: TanStack Query for optimistic updates and cache management
- **Form Validation**: React Hook Form with Zod schema validation
- **Responsive Design**: Mobile-friendly admin interface

### Public Portfolio
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Code splitting and lazy loading
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

1. **Public Portfolio**: Static data fetched from API endpoints and cached by TanStack Query
2. **Admin Operations**: Authenticated API calls with optimistic updates and cache invalidation
3. **Database Operations**: Type-safe queries through Drizzle ORM with PostgreSQL
4. **Session Management**: Automatic session validation on protected routes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **express**: Web application framework
- **bcryptjs**: Password hashing
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **react-hook-form**: Form state management

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety
- **eslint**: Code linting
- **postcss**: CSS processing

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations manage schema changes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **PORT**: Server port configuration

### Production Deployment
- Server serves both API endpoints and static frontend assets
- Single process deployment with Express serving static files
- Database migrations run via `npm run db:push`

## Changelog

```
Changelog:
- June 28, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```