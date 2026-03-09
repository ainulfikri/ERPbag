import { db } from "../../core/db";

export type Product = {
    id: number;
    name: string;
    unit: string;
    stock: number;
    createdAt: string;
};

export function getAll() {
    return db.prepare("SELECT * FROM products ORDER BY name ASC").all();
}

export function add(data: { name: string; unit: string }) {
    const stmt = db.prepare("INSERT INTO products (name, unit) VALUES (?, ?)");
    return stmt.run(data.name, data.unit).lastInsertRowid;
}

export function update(id: number, data: { name: string; unit: string }) {
    const stmt = db.prepare("UPDATE products SET name = ?, unit = ? WHERE id = ?");
    return stmt.run(data.name, data.unit, id);
}

export function remove(id: number) {
    return db.prepare("DELETE FROM products WHERE id = ?").run(id);
}
