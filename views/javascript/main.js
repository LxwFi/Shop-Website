const Items = require("../../tables/items");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("../../data.db");
const item = new Items(db);

async function descChange() {
    
}

async function delItem() {

}

async function goFetch() {
    const response = await fetch("/cartValues", { method: "GET" })
    const cartValues = response.text();
    console.log(await cartValues);
    if (await cartValues != "[]") {
        console.log("yeah");
        window.location.replace("http://localhost:3000/cart");
        return;
    } else {
        alert("Your cart is empty!")
    }

}