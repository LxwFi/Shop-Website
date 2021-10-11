const express = require('express');
const web = express();
const fs = require("fs");
const port = 3000;
const path = require("path");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
let rawdata = fs.readFileSync(path.resolve(__dirname, 'seed.json'));
let data = JSON.parse(rawdata);

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
web.use(express.static('public'));

web.get("/", (req, res) => {
    res.sendStatus(200);
});



web.post("", (req, res) => {
    if (q) {
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

web.delete("", (req, res) => {

});









console.log(data);

web.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});