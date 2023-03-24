const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('messages.db');

const sql = 'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, message TEXT)';
db.run(sql);