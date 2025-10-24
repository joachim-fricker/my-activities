import sqlite3 from 'sqlite3';
import path from 'path';



class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        const dbPath = path.join('data.db');
        
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opeming Datenbank:', err.message);
            } else {
                console.log('✅ Connection to SQLite DB established');
            }
        });
    }


    // Generic query method with Promise
    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Generic run method for INSERT, UPDATE, DELETE
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID, 
                        changes: this.changes 
                    });
                }
            });
        });
    }

    // Get single row 
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Fehler beim Schließen der DB:', err);
                } else {
                    console.log('✅ Datenbankverbindung geschlossen');
                }
            });
        }
    }
}

export const db= new Database();
export default db