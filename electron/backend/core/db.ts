import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import { initSchema } from "./schema";

// Path to SQLite file
const dbPath = path.join(app.getPath("userData"), "erpbag.db");

// Create database connection
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize tables
initSchema();
