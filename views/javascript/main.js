
async function autoInput() {
    const descSelector = document.getElementById("desc-name")
    const res = await fetch(`/desc/${descSelector.value}`, { method: "GET" });
    document.getElementById("description").value = await res.text()
}

//Function to change description
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

//Function to add new items
async function itemAdd() {
    var title = document.getElementById("name");
    var price = document.getElementById("price");
    var description = document.getElementById("desc");
    var category = document.getElementById("category");
    var image = document.getElementById("image");
    var req = {
        "title": `${title.value}`,
        "price": price.value,
        "description": `${description.value}`,
        "category": `${category.value}`,
        "image": `${image.value}`
    }
    await fetch(`/items`, {
        method: "POST",
        body: JSON.stringify(req),
        headers: {
            "Content-Type": "application/json"
        }
    });
    location.reload();
}

//Function to delete items
async function delItem() {
    var selected = document.getElementById("del-item");
    await fetch(`/titleToID/${selected.value}`, { method: 'DELETE' });
    location.reload();
}

//Function to delete categories
async function delCat() {
    var selected = document.getElementById("del-cat");
    await fetch(`/category/${selected.value}`, { method: 'DELETE' });
    location.reload();
}

//This checks if the cart is empty, and prevents the user going to the cart if so
async function goFetch() {
    const response = await fetch("/cartValues", { method: "GET" });
    const cartValues = response.text();
    if (await cartValues != "[]") {
        window.location.replace("http://localhost:3000/cart");
        return;
    } else {
        alert("Your cart is empty!")
    }

}