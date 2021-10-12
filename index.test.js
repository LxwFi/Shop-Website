const request = require("supertest");
const web = require("./index");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("test.db");
const Items = require("./tables/items")
const item = new Items(db);


describe("GET /category", () => {
    test("Should return categories or nothing", async () => {
        const response = await request(web).get("/category");
        expect(response.statusCode).toBe(200);
    });
});

describe("POST /items", () => {
    describe("Given all correct params (title, price, desc, cateogry, image)", () => {
        test("responses with 200", async () => {
            const response = await request(web).post("/items").send({
                "title": "Phone",
                "price": 120,
                "description": "This is a phone",
                "category": "electronics",
                "image": "www.url.com"
            });
            expect(response.statusCode).toBe(200)
        });
        test("Gives success message", async () => {
            const response = await request(web).post("/items").send({
                "title": "Phone",
                "price": 120,
                "description": "This is a phone",
                "category": "electronics",
                "image": "www.url.com"
            });
            expect(response.headers['content-type']).toEqual("text/plain; charset=utf-8");
        });
        test("Adds to database", async () => {
            await request(web).post("/items").send({ "title": "Phone", "price": 120, "description": "This is a phone", "category": "electronics", "image": "www.url.com" });
            const [items] = await item.dbAll(`SELECT * FROM Items WHERE title = "Phone" AND price = 120 AND desc = "This is a phone" AND category = (SELECT ID FROM Categories WHERE Category = "electronics") AND imageURL = "www.url.com"`);
            expect([items].length).toBeGreaterThan(0);
        });
    });
});