# Overview

e Nessa Banda Mekié is a Node.js web application built with Express.js that serves as a music platform. The application uses EJS templating with layouts for server-side rendering and provides a clean, responsive interface for content management and presentation. The project follows an MVC (Model-View-Controller) architectural pattern with separate routing, controller logic, and view templates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Template Engine**: EJS (Embedded JavaScript) with express-ejs-layouts for consistent page layouts
- **Static Assets**: Organized in `/public/assets/` with separate CSS and JavaScript files
- **Responsive Design**: CSS media queries handle mobile responsiveness with a collapsible navigation menu
- **Styling Approach**: Modular CSS files for different components (navbar, home, footer, responsive)

## Backend Architecture
- **Framework**: Express.js 5.1.0 server application
- **Routing Strategy**: Centralized routing in `/routes/index.js` with controller delegation
- **Controller Pattern**: Business logic separated into `/controllers/mainController.js`
- **View Structure**: EJS templates in `/views/` directory with shared layout system
- **Static File Serving**: Express static middleware serves assets from `/public/`

## Application Structure
- **Entry Point**: `server.js` configures Express app with middleware and route mounting
- **Port Configuration**: Runs on PORT environment variable or defaults to 5000
- **Host Binding**: Configured to bind to '0.0.0.0' for container/cloud deployment compatibility

## Key Design Decisions
- **Layout System**: Uses express-ejs-layouts for DRY principle in template management
- **Asset Organization**: Logical separation of CSS, JavaScript, and image assets
- **Route Handling**: Clean separation between route definitions and business logic
- **Responsive Strategy**: Mobile-first approach with JavaScript-enhanced navigation

# External Dependencies

## Core Dependencies
- **express**: Web application framework (v5.1.0)
- **ejs**: Template engine for dynamic HTML generation (v3.1.10)
- **express-ejs-layouts**: Layout support for EJS templates (v2.5.1)

## Development Dependencies
- No additional development dependencies are currently configured

## Third-party Services
- No external APIs or services are currently integrated
- No database connections are established
- No authentication providers are configured

## Infrastructure Requirements
- Node.js runtime environment
- Static file hosting capability
- No database requirements in current implementation

# Project Features

## Music Platform Features
- **Music Discovery**: Browse categories like Kuduro, Rap, Afro House, Semba, Kizomba, and Gheto Zouk
- **User Authentication**: Registration and login system with session management
- **Music Interaction**: Play, download, and like functionality for tracks
- **Artist Profiles**: Featured artists sections with engagement metrics

## Paid Music Promotion System
- **Artist Submission Form**: Comprehensive form with personal details, music files, and biography
- **Payment Modal Interface**: Full-screen overlay modal displaying bank details for AOA 15,000 payment
- **Proof of Payment Upload**: File upload system for payment receipt verification
- **Admin Management Panel**: Complete workflow for reviewing, approving, and rejecting promotion requests
- **Status Tracking**: Real-time filtering by pending, approved, and rejected submissions

## Recent Technical Implementations
- **Category Playlist System**: Complete implementation of category-wide music playback with interactive play/pause controls and visual feedback
- **Simplified Button Interface**: Streamlined button texts ("Ouvir"/"Baixar" instead of "Ouvir agora"/"Baixar agora") for cleaner UI
- **Enhanced Play Controls**: Interactive toggle functionality across all music interfaces with yellow/orange color scheme and pulse animations
- **Audio State Management**: Comprehensive audio control system preventing conflicts between different playback contexts
- **Modal-based Payment Flow**: Replaced inline payment cards with full-screen overlay modals for better UX
- **Form State Management**: Prevents data submission until payment proof is uploaded
- **Responsive Design**: Mobile-optimized interface with proper scroll handling
- **Animation System**: Smooth modal transitions and user feedback animations