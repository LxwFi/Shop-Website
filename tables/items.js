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
    dbAll(sql, p = []) {
        return new Promise((resolve, reject) => {
            this.database.all(sql, p, (err, rows) => {
                if (err) { reject(err); }
                resolve(rows);
            });
        });
    }
    async add(title, price, desc, cat, imageUrl) {
        // Takes in the item params and adds it to the databse
        const Category = new Categories(this.database);
        await Category.add(cat);  // Creates a category if it doesn't exist
        try {
            const [exist] = await this.dbAll("SELECT id FROM Items WHERE title = (?) AND category = (SELECT id FROM Category WHERE category = (?))",
            [title, cat])
        if (typeof exist === 'undefined') {
            this.database.serialize(() => {
                this.database.run(`
                    INSERT INTO Items
                    (title, price, desc, category, imageUrl)
                    VALUES ((?),(?),(?),
                    (SELECT id FROM Categories WHERE category = (?)), (?))`,
                    [title, price, desc, cat, imageUrl])
            }); // Inserts new item  into the databse
        }
        } catch {
            this.database.serialize(() => {
                this.database.run(`
                    INSERT INTO Items
                    (title, price, desc, category, imageUrl)
                    VALUES ((?),(?),(?),
                    (SELECT id FROM Categories WHERE category = (?)), (?))`,
                    [title, price, desc, cat, imageUrl])
            });
        }
    }
    async remove(id) {
        // Takes in the param of an item title and category
        // Checks if it exists and if does, removes it from database
        const [exist] = await this.dbAll("SELECT * FROM Items WHERE id = (?)",
            [id])
        const cat = await this.dbAll("SELECT * FROM Items WHERE category = (SELECT category FROM Items WHERE id = (?))", [id])
        const catid = await this.dbAll("SELECT category FROM Items WHERE id = (?)")
        if (typeof exist !== 'undefined') {
            this.database.serialize(() => {
                this.database.run(`
                DELETE FROM Items WHERE id = (?)`, [id])
            });
        }
        console.log(exist.category)
        if (cat.length <= 1) {
            const catty = new Categories(this.database)
            await catty.remove(exist.category)
        }

    }
    async descChange(id, newDesc) {
        // Takes in an items title and category with a new description
        // Changes the items description if it exists
        const [exist] = await this.dbAll("SELECT * FROM Items WHERE id = (?)", [id]);
        if (typeof exist !== 'undefined') {
            this.database.serialize(() => {
                this.database.run(`
                UPDATE Items SET desc = (?) WHERE id = (?)`, [newDesc, id])
            });
        }
    }
    async all(category = 0) {
        // Returns a list of all items
        // If category param is given, it'll return the items in the category id
        if (category == 0) {
            return await this.dbAll("SELECT * FROM Items")
        }
            return await this.dbAll("SELECT * FROM Items WHERE category = (SELECT id FROM Categories WHERE category = (?))", [category])
    }
    async get(id) {
        // Returns an object of an item given the id param
        return await this.dbAll("SELECT * FROM Items WHERE id = (?)", [id])
    }
    async allTitle() {
        const titles = [];
        const tits = await this.dbAll("SELECT title FROM Items")
        for (let t of tits) {
            titles.push(t.title)
        }
        return titles
    }
    async titleToID(title) {
        const [id] = await this.dbAll("SELECT id FROM Items WHERE title = (?)", [title])
        return id.id
    }
}

module.exports = Items;