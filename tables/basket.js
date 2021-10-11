const sqlite3 = require("sqlite3").verbose();

class Basket {
    constructor(database) {
        // Takes in database connection to run SQL to database
        // Creates the basket table if doesn't already exist
        this.database = database;
        this.database.serialize(() => {
            this.database.run(`
            CREATE TABLE IF NOT EXISTS Basket(
                item INTEGER
            )`);
        });
    }
    add(item) {
        // Takes in the param of the id of item being added to basket
        await this.database.all("SELECT * FROM Basket WHERE item = (?)",
            [item], (err, rows) => {
                if (err) {
                    throw err;
                };
                if (rows.length === 0) { // If item not already in basket
                    this.database.serialize(() => {
                        this.database.run(`
                        INSERT INTO Basket (item) VALUES ((?))`,
                            [item]); // Adds item to basket table
                    });
                }
            });
    }
    remove(item) {
        // Takes in the param of the id of item being removed from basket
        await this.database.all("SELECT * FROM Basket WHERE item = (?)",
            [item], (err, rows) => {
                if (err) {
                    throw err;
                };
                if (rows.length === 1) { // If item is in basket
                    this.database.serialize(() => {
                        this.database.run(`
                        DELETE FROM Basket WHERE item = (?)`,
                            [item]); // Removes item from basket table
                    });
                }
            });
    }
}

module.exports = Basket;