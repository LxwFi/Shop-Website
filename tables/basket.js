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
    dbAll(sql , p = []) {
        return new Promise((resolve, reject) => {
            this.database.all(sql, p, (err, rows) => {
                if (err) {reject(err);}
                resolve(rows);
            });
        });
    }
    async add(item) {
        // Takes in the param of the id of item being added to basket
        if (isNaN(item)){throw "Is not a number"}
        const [exist] = await this.dbAll("SELECT * FROM Basket WHERE item = (?)", [item])
        const [it] = await this.dbAll("SELECT * FROM Items WHERE id = (?)", [item])
        if (typeof exist === 'undefined' && typeof it !== 'undefined' ) {
            this.database.serialize(() => {
                this.database.run(`
                INSERT INTO Basket (item) VALUES ((?))`, [item])
            })
        }
    }
    async getItems() {
        // Returns all items in a list of objects in the basket
        const ret = [];
        const its = await this.dbAll("SELECT * FROM Basket")
        try {
            for (let i of its) {
                const [is] = await this.dbAll("SELECT title, price, imageUrl FROM Items WHERE id = (?)", i.item)
                ret.push(is)
            }
            return ret;
        } catch {
            return 0;
        }
        
        
    }
    async clear() {
        // Clears all items in the basket
        const [exist] = await this.dbAll("SELECT * FROM Basket")
        if (typeof exist !== 'undefined') {
            this.database.serialize(() => {
                this.database.run(`
                DELETE FROM Basket`)
            });
        }
    }
    async total() {
        // Returns the total value of all items in the basket
        let ret = 0;
        const its = await this.dbAll("SELECT * FROM Basket")
        try {
            for (let i of its) {
                const [p] = await this.dbAll("SELECT price FROM Items WHERE id = (?)", i.item)
                ret += p.price
            }
            return ret.toFixed(2);
        } catch {
            return 0;
        }
        
    }
}


module.exports = Basket;