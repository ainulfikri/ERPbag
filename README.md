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
- Inventory module (materials: fabric & non-fabric)
- Tailor module (basic listing & status handling)
- Shared layout with sidebar navigation
- Frontend ↔ Backend communication via Electron IPC
- Read-only data loading from SQLite

## In Progress
- Inventory empty state
- Add Material modal & form
- Database schema finalization
- UI polishing and component reuse

## Planned Features
- Material CRUD (add / edit / delete)
- Production management
- Dashboard & analytics
- Transactions & sales
- Basic accounting

## Project Status
Early development, **architecture-first approach**.

Current focus:
- Solid Electron + React + SQLite integration
- Clear separation between frontend, backend, and database layers
- Offline-first workflow

## Notes
ERPBag is designed to work entirely offline to support small workshops with limited or unreliable internet access.

## Next Steps
- Finalize SQLite schema
- Implement Material creation (Add Material)
- Sync frontend form → backend → database
