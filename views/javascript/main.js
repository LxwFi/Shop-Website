// //const Items = require("../../tables/items");
// import Items from "../../tables/items";
// // const sqlite3 = require("sqlite3");
// import { sqlite3 } from "sqlite3";
// const db = new sqlite3.Database("../../data.db");
// const item = new Items(db);

async function descChange() {
    var selected = document.getElementById("desc-name");
    var newDesc = document.getElementById("description");
    var req = { 'desc': `${newDesc.value}` }
    await fetch(`/desc/${selected.value}`, {
        method: "PATCH",
        body: JSON.stringify(req),
        headers: {
            "Content-Type": "application/json"
          }
    });
    location.reload();
}

async function delItem() {
    var selected = document.getElementById("del-item");
    await fetch(`/titleToID/${selected.value}`, { method: 'DELETE' });
    location.reload();
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