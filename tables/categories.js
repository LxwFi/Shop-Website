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
    async add(category) {
        // Takes in the param of the name of category to add
        await database.all("SELECT id FROM Categories WHERE category = (?)",
            [category],
            (err, rows) => {
                if (err) {
                    throw err;
                };
                if (rows.length === 0) { // Checks if category doesn't exist
                    this.database.serialize(() => {
                        this.database.run(`
                        INSERT INTO Categories
                        (category)
                        VALUES ((?))
                        `, [category]);
                    });
                    return
                }
                else { throw "Already exists!" }
            });
    }
    async remove(category) {
        // Takes in the param of the name of category to delete
        await database.all("SELECT id FROM Categories WHERE category = (?)",
            [category],
            (err, rows) => {
                if (err) {
                    throw err;
                };
                if (rows.length === 0) { // Checks if the category doesn't exist
                    throw "Doesn't exist!"
                }
                this.database.serialize(() => {
                    this.database.run(`
                    DELETE FROM Categories WHERE category = (?)`, // Removes category from DB
                        [category]); 
                });
        });
    }
}

module.exports = Categories;