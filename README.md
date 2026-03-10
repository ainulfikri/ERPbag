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
- 🏠 **Premium Dashboard**: High-contrast analytics, live production feeds, and stock alerts.
- 📦 **Inventory Management**: Visual stock tracking, material categorization, and low-stock warnings.
- 🤝 **Production Partners**: Tailor management with performance status and automated profiles.
- 🛍️ **Product Catalog**: Visual grid gallery for finished goods with real-time stock awareness.
- ⚙️ **Production Engine**: Timeline-based batch tracking (Cutting → Sewing → QC).
- 💰 **Sales & CRM**: Premium order tracking, customer profiles, and transaction management.
- 📒 **Financial Ledger**: Accounting with profit/loss visualization and glassmorphism summaries.
- 📊 **Business Intelligence**: Advanced monthly revenue and material consumption reports.

## Future Roadmap
- [ ] Setup Electron-builder for a downloadable `.exe` (Stable Release)
- [ ] Export to PDF/Excel for all reports
- [ ] Multi-currency support (IDR, USD, EUR)
- [ ] Cloud synchronization (Optional)
- [ ] Mobile companion app

## Project Status
Active development, **UI Polishing & Stabilization phase**.
