# ERPBag

ERPBag is an offline-first ERP desktop application designed for small-scale bag production businesses, such as spunbond bag workshops.

## Goal
To provide a simple, reliable desktop ERP system that replaces manual bookkeeping and helps manage inventory, tailors, and production workflows without requiring constant internet access.

## Tech Stack
- React + TypeScript
- Electron
- Vite
- SQLite (local database)

## Architecture
- **Frontend**: React + TypeScript (Vite)
- **Desktop shell**: Electron
- **Backend**: Node.js (Electron main process)
- **Database**: SQLite (via better-sqlite3)
- **IPC bridge**: Secure preload API (`window.api`)

## Current Features
- **Modern Interface**: App Switcher, Top Navigation, and standardized Sidebar.
- **Inventory Module**: Full Material CRUD and stock tracking.
- **Tailor Module**: Management of tailor profiles and active/inactive status.
- **Product Catalog**: Management of finished bag types.
- **Production Module**: Batch tracking linking Materials, Tailors, and Products.
- **Sales & CRM**: Order creation with automatic warehouse stock deduction.

## In Progress
- Functional Dashboard with real-time analytics.
- Improved error handling and validation for all modules.
- Refining the "Offline-First" sync logic.

## Planned Features
- Basic accounting (Profit/Loss tracking).
- Advanced reports (Monthly sales, material usage).
- Printable invoices and receipts (PDF generation).
- Production build setup (Electron Forge/Builder).

## Project Status
Active development, **feature-building phase**.

Current focus:
- **Data Insights**: Turning collected data into useful dashboard statistics.
- **Polishing Navigation**: Ensuring smooth transitions between all apps.

## Next Steps
- Implement Dashboard summary cards (Total Sales, Active Batches).
- Add Low Stock visual alerts.
- Setup Electron-builder for a downloadable `.exe`.
