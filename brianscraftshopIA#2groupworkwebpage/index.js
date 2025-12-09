document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".product-card button");

    // product data
    const products = {
        "prod-1": { name: "Craft Clay", price: 60.00 },
        "prod-2": { name: "Wooden Beads Set", price: 80.00 },
        "prod-3": { name: "Art Paint Set", price: 50.00 },
        "prod-4": { name: "Handmade Necklace", price: 100.00 },
        "prod-5": { name: "Palm Leaf Fan", price: 200.00 },
        "prod-6": { name: "Jamaican Tote Bag", price: 300.00 },
        "prod-7": { name: "Woven Basket", price: 200.00 },
        "prod-8": { name: "Hand-Painted Mug", price: 500.00 },
        "prod-9": { name: "Seed Bracelet", price: 150.00 },
        "prod-10": { name: "Rasta Flag Wall Art", price: 600.00 },
        "prod-11": { name: "Carved Wooden Figure", price: 1200.00 },
        "prod-12": { name: "Seashell Necklace", price: 700.00 },
        "prod-13": { name: "Coconut Bowl", price: 500.00 },
        "prod-14": { name: "Hand Painted Tote", price: 40.00 },
        "prod-15": { name: "Mini Hand Drum", price: 1000.00 },
        "prod-16": { name: "Canvas Painting", price: 2000.00 },
        "prod-17": { name: "Rasta Bracelet", price: 150.00 },
        "prod-18": { name: "Handmade Clay Jar", price: 650.00 },
        "prod-19": { name: "Palm Leaf Trinket", price: 200.00 },
        "prod-20": { name: "Canvas Bag", price: 500.00 },
        "prod-21": { name: "Seashell Wall Art", price: 650.00 },
        "prod-22": { name: "Rasta Flag Pin", price: 50.00 },
        "prod-23": { name: "Handmade Earrings", price: 280.00 },
        "prod-24": { name: "Jute Storage Basket", price: 450.00 },
        "prod-25": { name: "Hand-Painted Tray", price: 55.00 },
        "prod-26": { name: "Mini Drum Keychain", price: 320.00 },
        "prod-27": { name: "Coconut Candle", price: 200.00 },
        "prod-28": { name: "Handmade Clay Pot", price: 800.00 },
        "prod-29": { name: "Rasta Hat", price: 350.00 },
        "prod-30": { name: "Hand-Painted Coasters", price: 180.00 }
    };

    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {

            // check login
            const currentUser = localStorage.getItem("currentUser"); 
            if (!currentUser) {                                      
                alert("You must be logged in to add items to your cart."); 
                window.location.href = "login.html";                
                return;                                             
            }

            const id = button.dataset.productId;
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // check if item exists
            let existing = cart.find(item => item.id === id);

            if (existing) {
                existing.qty += 1;  // increase qty
            } else {
                cart.push({
                    id: id,
                    name: products[id].name,
                    price: products[id].price,
                    qty: 1
                });
            }

            // save cart
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Item added to cart");
        });
    });
});
