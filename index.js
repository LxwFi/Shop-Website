const express = require('express');
const web = express();
const fs = require("fs");
const port = 3000;
const path = require("path");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
let rawdata = fs.readFileSync(path.resolve(__dirname, 'seed.json'));
let data = JSON.parse(rawdata);
const sqlite3 = require("sqlite3");
const Items = require("./tables/items");
const Categories = require("./tables/categories");
const Basket = require("./tables/basket");
const db = new sqlite3.Database("data.db");
const item = new Items(db);
const cat = new Categories(db);
const cart = new Basket(db);
web.use(express.static(path.join(__dirname, '/views')));

const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});

web.engine("handlebars", handlebars);
web.set("view engine", "handlebars");
web.set('views', path.join(__dirname, 'views'));
web.use(express.urlencoded({ extended: true }));
web.use(express.json());

web.get("/", async (req, res) => {
    const items = await item.all();
    console.log(items);
    res.render("home", { items });
})


web.get("/create", (req, res) => {

});

web.post("/items", (req, res) => {
    const { title, price, description, category, image } = req.body
    if (!title || !price || !description || !category || !image) {
        res.sendStatus(400);
    }
    item.add(title, price, description, category, image);
    res.sendStatus(200);
});


web.delete("/delete/:id", (req, res) => {
    if (req.params.id){
        cart.remove(req.params.id);
        console.log("Deleting from cart with id " + req.params.id);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(400);

});

async function runThis() {
    for (i of data) {
        const { title, price, description, category, image } = i
        await item.add(title, price, description, category, image);
    }
}



web.listen(port, async () => {
    console.log(`Server listening at http://localhost:${port}`);
});