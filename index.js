const express = require('express');
const web = express();
const fs = require("fs");
const port = 3000; // change number here to whatever you want
const path = require("path");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
let rawdata = fs.readFileSync(path.resolve(__dirname, 'seed.json'));
let test = JSON.parse(rawdata);
const sqlite3 = require("sqlite3");
const Items = require("./tables/items");
const Categories = require("./tables/categories");
const Basket = require("./tables/basket");
const db = new sqlite3.Database("data.db"); // change name of "data".db to whatever database name you are using
require('dotenv').config()
const item = new Items(db);
const cat = new Categories(db);
const cart = new Basket(db);
web.use(express.static(path.join(__dirname, '/views')));
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { clear } = require('console');
const { title } = require('process');
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});
web.engine("handlebars", handlebars);
web.set("view engine", "handlebars");
web.set('views', path.join(__dirname, 'views'));
web.use(express.urlencoded({ extended: true }));
web.use(express.json());


//main page + console log to show if someone is visiting
web.get("/", async (req, res) => {
    const items = await item.all();
    const categories = await cat.all();
    console.log("Someone is visiting the website...");
    res.render("home", { items, categories });
});

// CART SUFF

//get the cart web page
web.get("/cart", async (req, res) => {
    const items = await cart.getItems()
    const total = await cart.total();
    const categories = await cat.all();
    res.render("cart", { items, total, categories });
});

//used to check if cart is empty
web.get("/cartValues", async (req, res) => {
    const items = await cart.getItems();
    res.send(items);
});

//"purchase" function for the website
web.delete("/clear", async (req, res) => {
    const a = await cart.total();
    await cart.clear();
    console.log("Purchased items worth ??" + a);
});

//renders "clear"
web.get("/clear", async (req, res) => {
    const categories = await cat.all();
    res.render("clear", { categories });
});

//add to cart
web.post("/cart/:id", (req, res) => {
    if (req.params.id) {
        cart.add(req.params.id);
        console.log("Adding item to cart with ID " + req.params.id);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

// LOGIN

//takes you to login
web.get("/login", async (req, res) => {
    const categories = await cat.all();
    const reject = () => {
        res.setHeader('www-authenticate', 'Basic')
        res.sendStatus(401)
    }
    const authorization = req.headers.authorization
    if (!authorization) {
        return reject()
    }
    const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':')
    if (!(password === process.env.password)) {   //set password manually here or in your own .env file
        return reject()
    }
    const items = await item.allTitle();
    console.log(username + " has logged in");
    res.render("login", {items, categories})
});

// ITEMS

//displays specific product
web.get("/product/:id", async (req, res) => {
    const items = await item.get(req.params.id);
    const categories = await cat.all();
    res.render("product", { items, categories });
});

//deletes item (used in admin page)
web.delete("/titleToID/:title", async (req, res) => {
    const iid = await item.titleToID(req.params.title);
    console.log("Deleting item with ID " + iid);
    await item.remove(iid);
    res.sendStatus(200)
})

//add new items, creates a new category if it doesnt exist
web.post("/items", async (req, res) => {
    const { title, price, description, category, image } = req.body
    if (!title || !price || !description || !category || !image) {
        res.sendStatus(400);
    }
    console.log("Adding new item with title " + title + " under the category " + category);
    item.add(title, price, description, category, image);
    res.sendStatus(200);
});

//change the description of an item
web.patch("/desc/:id", async (req, res) => {
    if (req.params.id) {
        const { desc } = req.body
        const iid = await item.titleToID(req.params.id)
        item.descChange(iid, desc);
        console.log("Changing desc for item with ID " + iid);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

//get item description
web.get("/desc/:title", async (req, res) => {
    if (req.params.title) {
        const [it] = await item.get(await item.titleToID(req.params.title));
        res.send(it.desc);
    }
})

// CATEGORIES

//specific categories
web.get("/:id", async (req, res) => {
    const items = await item.all(req.params.id);
    const categories = await cat.all();
    const categoryLower = req.params.id;
    const category = categoryLower[0].toUpperCase() + categoryLower.substring(1);
    res.render("home", { items, category, categories });
});

//delete category (deletes all items in a category)
web.delete("/category/:id", async (req, res) => {
    const iid = await cat.titleToID(req.params.id);
    if (req.params.id) {
        await cat.remove(iid);
        console.log("Deleting category with id " + iid);
        res.sendStatus(200);
        return;
    }
    console.log("Category with ID " + iid + " doesn't exist")
    res.sendStatus(400);
});



// MISC

//function to create a database from seeded data
async function runThis() {
    for (i of test) {
        const { title, price, description, category, image } = i
        await item.add(title, price, description, category, image);
    }
}

//loop to clear out db after testing, replace "number" with a number
// let i = "number";
// while (i < 100){
//     item.remove(i);
//     console.log("removing item with ID " + i);
//     i++;
// }


web.listen(port, async () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = web;