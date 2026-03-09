import { db } from "../../core/db";
import { Tailor } from "../../../../frontend/types/tailor";

export function getAllTailors(): Tailor[] {
    const stmt = db.prepare("SELECT * FROM tailors ORDER BY name");
    return stmt.all() as Tailor[];
}

export function addTailor(name: string, phone: string) {
    const stmt = db.prepare("INSERT INTO tailors (name, phone) VALUES (?, ?)");
    const result = stmt.run(name, phone);
    return result.lastInsertRowid;
}

export function toggleTailorStatus(id: number, active: number) {
    const stmt = db.prepare("UPDATE tailors SET active = ? WHERE id = ?");
    return stmt.run(active, id);
}
