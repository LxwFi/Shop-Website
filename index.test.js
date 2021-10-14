const request = require("supertest");
const web = require("./index");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("test.db");
const Items = require("./tables/items")
const Categories = require("./tables/categories");
const Basket = require("./tables/basket");
const item = new Items(db);
const category = new Categories(db);
const bask = new Basket(db)

function dbAll(sql, p = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, p, (err, rows) => {
            if (err) { reject(err); }
            resolve(rows);
        });
    });
}

describe("Catergoy Tests", () => {
    // describe("GET /categories", () => {
    //     test("Should return a 200 response", async () => {
    //         const response = await request(web).get("/category");
    //         expect(response.statusCode).toBe(200);
    //     });
    //     test("Should return categories in JSON", async () => {
    //         const response = await request(web).get("/category");
    //         expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
    //     });
    // });
    describe("Creating Categories", () => {
        test("Should create new category", async() => {
            await request(web).post("/items").send({
                "title": "New Item",
                "price": 12,
                "description": "Neew",
                "category": "NewCat",
                "image": "www.url.com"
            });
            const [checkDB] = await dbAll("SELECT * FROM Categories WHERE category = 'NewCat'")
            expect([checkDB].length).toBeGreaterThan(0)
        });
    });
    describe("Delete Categories", () => {
        // test("Should delete a real category", async () => {
        //     await request(web).post("/items").send({
        //         "title": "New Item",
        //         "price": 12,
        //         "description": "Neew",
        //         "category": "NewCat2",
        //         "image": "www.url.com"
        //     });
        //     const res = await request(web).delete(`/category/1`)
        //     expect(res.statusCode).toBe(200)
        //});
        test("ID is invalid, should 400", async () => {
            const res = await request(web).delete(`/category/900`)
            expect(res.statusCode).toBe(400)
        });
    });
});

describe("Items Tests", () => {
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
        describe("Given no params / missing params, should 400", () => {
            test();
        })
    });
})


describe("Cart Tests", () => {
    describe("POST /cart/:id", () => {
        test("Should add item ID to cart", async () => {
            await request(web).post("/items").send({
                "title": "Post",
                "price": 1,
                "description": "Post",
                "category": "electronics",
                "image": "www.url.com"
            });
            const res = await request(web).post("/cart/1");
            expect(res.statusCode).toBe(200);
            const [da] = await dbAll("SELECT * FROM Basket")
            expect([da].length).toBeGreaterThan(0);
        })
    })
    describe("GET /cartValues", () => {
        test("Should return values from the cart", async () => {
            const res = await request(web).get("/cartValues")
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toEqual(expect.stringContaining("json"));
        })
    })
    // describe("DELETE /clear", () => {
    //     test("Clears the entire cart", async () => {
    //         const res = await request(web).delete("/clear");
    //         const [exist] = await dbAll("SELECT * FROM Basket")
    //         expect(res.statusCode).toBe(200)
    //         expect(exist).toEqual('undefined')
    //     })
    // })
})
