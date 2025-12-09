// Runs when the page finishes loading
document.addEventListener("DOMContentLoaded", () => {

    // Get the payment input field
    const paymentField = document.getElementById("payment");

    // Create a place to show the cart summary
    let cartSummary = document.createElement("div");
    cartSummary.id = "cart-summary";
    paymentField.parentElement.insertBefore(cartSummary, paymentField);

    // Get cart data
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // If cart is empty
    if (cart.length === 0) {
        cartSummary.innerHTML = "<p>Your cart is empty.</p>";
        paymentField.value = "$0.00";

    } else {
        let total = 0;

        // Start building sumary table
        let summaryHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Add each cart item to summary
        cart.forEach(item => {
            let subtotal = item.price * item.qty;
            total += subtotal;

            summaryHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${subtotal.toFixed(2)}</td>
                </tr>
            `;
        });

        // Finish table
        summaryHTML += `</tbody></table>`;
        cartSummary.innerHTML = summaryHTML;

        // Show total amount
        paymentField.value = `$${total.toFixed(2)}`;
    }

    // Form submit 
    document.querySelector("form").addEventListener("submit", e => {
        e.preventDefault(); // Stop page refresh

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        alert("Order confirmed. Thank you for your purchase!");

        // Go to invoice page
        window.location.href = "invoice.html";
    });
});
