const sqlite3 = require("sqlite3").verbose();
const Categories = require("./categories")

 class Items {
     constructor(database) {
        // Takes in database connection to run SQL to database
        // Creates the table of items if doesn't exist already
        this.database = database;
        this.database.serialize(() => {
            this.database.run(`
            CREATE TABLE IF NOT EXISTS Items(
                id INTEGER PRIMARY KEY,
                title VARCHAR(255),
                price INTEGER,
                desc VARCHAR(255),
                category INTEGER,
                imageUrl VARCHAR(255)
            )`);
        });
    }
    async add(title, price, desc, cat, imageUrl) {
        // Takes in the item params and adds it to the databse
        await this.database.all("SELECT id FROM Categories WHERE category = (?)",
            [cat],
            (err, rows) => {
                if (err) {
                    throw err;
                };
                if (rows.length === 0) { // Check if category exists
                    const Category = new Categories(this.database);
                    Category.add(cat);  // Creates a category if it doesn't exist
                };
                this.database.serialize(() => {
                    this.database.run(`
                    INSERT INTO Items
                    (title, price, desc, category, imageUrl)
                    VALUES ((?),(?),(?),
                    (SELECT id FROM Categories WHERE category = (?)), (?))`,
                        [title, price, desc, cat, imageUrl])
                }); // Inserts new item  into the databse
            });
    }
    async remove(title, cat) {
        // Takes in the param of an item title and category
        // Checks if it exists and if does, removes it from database
        await this.database.all("SELECT id FROM Items WHERE title = (?) AND cat = (SELECT id FROM Categories WHERE category = (?))",
            [title, cat], (err, rows) => {
                if (err) {
                    throw err;
                };
                if (rows.length === 0) { // Checks if item doesn't exist
                    throw "Doesn't exist!";
                }
                this.database.serialize(() => {
                    this.database.run(`
                    DELETE FROM Items WHERE id = (?)`,
                        [rows[0]]); // Deletes item from database
                });
            });
    }
    async descChange(title, cat, newDesc) {
        // Takes in an items title and category with a new description
        // Changes the items description if it exists
        await this.database.all("SELECT id FROM Items WHERE title = (?) AND cat = (SELECT id FROM Categories WHERE category = (?))",
            [title, cat], (err, rows) => {
                if (err) {
                    throw err;
                };
                if (rows.length === 0) { // Checks if doesn't exist
                    throw "Doesn't exist!";
                }
                this.database.serialize(() => {
                    this.database.run(`
                    UPDATE Items SET desc = (?) WHERE id = (?)`,
                        [newDesc, rows[0]]); // Updates items new description
                });
            });
    }
}

module.exports = Items;