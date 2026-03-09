import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { app } from "electron";
import { initSchema } from "./schema";

const isDev = !app.isPackaged;
const dbName = isDev ? "erpbag_dev.db" : "erpbag.db";
const userDataPath = app.getPath("userData");
const dbPath = path.join(userDataPath, dbName);

// Ensure the directory exists
if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
}

console.log('Database path:', dbPath);

// Create database connection
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize tables
initSchema(db);
