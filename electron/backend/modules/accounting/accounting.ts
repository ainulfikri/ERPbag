import { db } from "../../core/db";

// Categories
export function getAllCategories() {
    return db.prepare("SELECT * FROM accounting_categories ORDER BY type ASC, name ASC").all();
}

// Transactions
export function getAllTransactions() {
    return db.prepare(`
        SELECT t.*, c.name as categoryName, c.type as categoryType
        FROM accounting_transactions t
        JOIN accounting_categories c ON t.categoryId = c.id
        ORDER BY t.date DESC
    `).all();
}

export function addTransaction(data: {
    categoryId: number;
    amount: number;
    description?: string;
    date?: string;
    referenceId?: number;
    referenceType?: string;
}) {
    const stmt = db.prepare(`
        INSERT INTO accounting_transactions (categoryId, amount, description, date, referenceId, referenceType)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const date = data.date || new Date().toISOString();
    return stmt.run(data.categoryId, data.amount, data.description || null, date, data.referenceId || null, data.referenceType || 'Manual').lastInsertRowid;
}

// Profit & Loss
export function getProfitLoss(startDate?: string, endDate?: string) {
    let queryIncome = "SELECT SUM(t.amount) as total FROM accounting_transactions t JOIN accounting_categories c ON t.categoryId = c.id WHERE c.type = 'Income'";
    let queryExpense = "SELECT SUM(t.amount) as total FROM accounting_transactions t JOIN accounting_categories c ON t.categoryId = c.id WHERE c.type = 'Expense'";

    const params: any[] = [];
    if (startDate && endDate) {
        queryIncome += " AND t.date BETWEEN ? AND ?";
        queryExpense += " AND t.date BETWEEN ? AND ?";
        params.push(startDate, endDate);
    }

    const income = db.prepare(queryIncome).get(startDate && endDate ? [startDate, endDate] : []) as { total: number };
    const expense = db.prepare(queryExpense).get(startDate && endDate ? [startDate, endDate] : []) as { total: number };

    const totalIncome = income.total || 0;
    const totalExpense = expense.total || 0;

    return {
        income: totalIncome,
        expense: totalExpense,
        profit: totalIncome - totalExpense
    };
}
