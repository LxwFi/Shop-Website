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
const item = new Items(db);
const cat = new Categories(db);
const cart = new Basket(db);
web.use(express.static(path.join(__dirname, '/views')));
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { clear } = require('console');
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
    console.log("Someone is visiting the website...");
    res.render("home", { items });
});


//cart of items
web.get("/cart", async (req, res) => {
    const items = await cart.getItems()
    const total = await cart.total();
    res.render("cart", { items, total });
});

web.get("/cartValues", async (req, res) => {
    const items = await cart.getItems();
    res.send(items)
});

//"purchase" function for the website
web.delete("/clear", async (req, res) => {
    const a = await cart.total()
    await cart.clear();
    console.log("Purchased with total " + a);
    res.sendStatus(200);
});

web.get("/clear", async (req, res) => {
    const a = await cart.total()
    if (a != 0){
        console.log("Purchased with total " + a);
        await cart.clear();
        res.render("clear");
    } else {
        console.log("Cart is empty!");
        return;
    }

});

// //"purchase" function for the website
// web.delete("/clear", async (req, res) => {
//     const a = await cart.total()
//     await cart.clear();
//     console.log("Purchased with total " + a);
//     res.sendStatus(200);
// });

//categories
web.get("/:id", async (req, res) => {
    const items = await item.all(req.params.id);
    const categoryLower = req.params.id;
    const category = categoryLower[0].toUpperCase() + categoryLower.substring(1);
    res.render("home", { items, category});
});

//displays specific product
web.get("/product/:id", async (req, res) => {
    const items = await item.get(req.params.id);
    res.render("product", { items });
});

//add new items, creates a new category if it doesnt exist
web.post("/items", async (req, res) => {
    const { title, price, description, category, image } = req.body
    if (!title || !price || !description || !category || !image) {
        res.sendStatus(400);
    }

    item.add(title, price, description, category, image);
    res.sendStatus(200);
});


//change the description of an item
web.patch("/desc/:id", (req, res) => {
    if (req.params.id) {
        const { desc } = req.body
        item.descChange(req.params.id, desc);
        console.log("Changing desc for item with ID " + req.params.id);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
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

//remove from cart
web.delete("/cart/:id", (req, res) => {
    if (req.params.id) {
        cart.remove(req.params.id);
        console.log("Deleting from cart with id " + req.params.id);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

//remove all from cart
web.delete("/cart", (req, res) => {
    cart.clear();
    res.sendStatus(200);
    return;
})


//delete item 
web.delete("/item/:id", (req, res) => {
    if (req.params.id) {
        item.remove(req.params.id);
        console.log("Deleting item with id " + req.params.id);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

//delete category (deletes all items in a category)
web.delete("/category/:id", (req, res) => {
    if (req.params.id) {
        cat.remove(req.params.id);
        console.log("Deleting category with id " + req.params.id);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);
});

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