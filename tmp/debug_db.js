const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

// In Electron, app.getPath('userData') is typically:
// Windows: %APPDATA%\erpbag
const userData = path.join(os.homedir(), 'AppData', 'Roaming', 'erpbag');
const dbPath = path.join(userData, 'erpbag.db');

console.log('Checking database at:', dbPath);

try {
    const db = new Database(dbPath);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables found:', tables.map(t => t.name).join(', '));

    if (tables.some(t => t.name === 'products')) {
        const columns = db.prepare("PRAGMA table_info(products)").all();
        console.log('Columns in "products":', columns.map(c => `${c.name} (${c.type})`).join(', '));

        const count = db.prepare("SELECT COUNT(*) as count FROM products").get();
        console.log('Product count:', count.count);
    } else {
        console.log('CRITICAL: "products" table is MISSING!');
    }
} catch (err) {
    console.error('Error opening database:', err.message);
}
