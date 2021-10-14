async function goFetch (){
    const response = await fetch("/cartValues", { method: "GET"})
    const cartValues = response.text();
    console.log(await cartValues);
    if (await cartValues != "[]" ) {
        console.log("yeah");
        window.location.replace("http://localhost:3000/cart");
        return;
    } else {
        alert("Your cart is empty!")
    }
    
}