const sqlite3 = require("sqlite3").verbose();

class Categories {
    constructor(database) {
        // Takes in database connection to run SQL to database
        // Creates the table of categories if doesn't exist already
        this.database = database;
        this.database.serialize(() => {
            this.database.run(`
            CREATE TABLE IF NOT EXISTS Categories(
                id INTEGER PRIMARY KEY,
                category VARCHAR(255)
            )`);
        });
    }
    dbAll(sql , p = []) {
        return new Promise((resolve, reject) => {
            this.database.all(sql, p, (err, rows) => {
                if (err) {reject(err);}
                resolve(rows);
            });
        });
    }
    async add(category) {
        // Takes in the param of the name of category to add
        const [cat] = await this.dbAll("SELECT * FROM Categories WHERE category = (?)", [category])
        if (typeof cat === 'undefined') {
            this.database.serialize(() => {
                this.database.run(`
                INSERT INTO Categories (category) VALUES
                ((?))`, [category]);
            });
        }
    }
    async remove(category) {
        // Takes in the param of the name of category to delete
        const [exist] = await this.dbAll("SELECT id FROM Categories WHERE category = (?)", [category])
        if (typeof exist !== 'undefined') {
            this.database.serialize(() => {
                this.database.run(`
                DELETE FROM Categories WHERE category = (?)`, [category])
            });
        }
    }
    async all() {
        const its = await this.dbAll("SELECT * FROM Items")
        return its
    }
}

module.exports = Categories;