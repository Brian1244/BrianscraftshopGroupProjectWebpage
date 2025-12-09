// Run when page is loaded
document.addEventListener("DOMContentLoaded", () => {

    // Get needed page elements
    const cartTable = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    // Load cart from storage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Show cart items
    function updateCartDisplay() {

        cartTable.innerHTML = ""; // Clear table

        cart.forEach((item, index) => {
            let subtotal = item.price * item.qty;

            // Build table row
            let row = `
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button class="qty-btn" data-index="${index}" data-action="minus">−</button>
                        ${item.qty}
                        <button class="qty-btn" data-index="${index}" data-action="plus">+</button>
                    </td>
                    <td>$${subtotal.toFixed(2)}</td>
                    <td><button class="remove-btn" data-index="${index}">Remove</button></td>
                </tr>
            `;

            cartTable.innerHTML += row; // Add row to table
        });

        // Update total
        let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        // Save updated cart
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Handle button clicks
    document.addEventListener("click", e => {

        // Quantity buttons
        if (e.target.classList.contains("qty-btn")) {
            let index = e.target.dataset.index;
            let action = e.target.dataset.action;

            if (action === "plus") {
                cart[index].qty += 1;
            } else if (action === "minus" && cart[index].qty > 1) {
                cart[index].qty -= 1;
            }

            updateCartDisplay();
        }

        // Remove button
        if (e.target.classList.contains("remove-btn")) {
            let index = e.target.dataset.index;
            cart.splice(index, 1);
            updateCartDisplay();
        }
    });

    updateCartDisplay(); // Load cart on start
});
