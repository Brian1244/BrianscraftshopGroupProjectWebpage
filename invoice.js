document.addEventListener("DOMContentLoaded", () => {
    // get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart data from localStorage:", cart); 

    // get elements from the page
    const invoiceDate = document.getElementById("invoice-date");
    const tbody = document.querySelector("#invoice-table tbody");
    const subtotalField = document.getElementById("subtotal");
    const taxField = document.getElementById("tax");
    const totalField = document.getElementById("total");
    const printButton = document.getElementById("print-invoice");
    const showBtn = document.getElementById("show-all-invoices");
    const myBtn = document.getElementById("my-invoices");

    
    if (showBtn) showBtn.addEventListener("click", ShowInvoices);
    if (myBtn) myBtn.addEventListener("click", GetUserInvoices);

    // show message if cart is empty
    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">No items in the invoice.</td></tr>`;
        subtotalField.textContent = "";
        taxField.textContent = "";
        totalField.textContent = "";
        printButton.style.display = "none"; 
        return;
    }

    // show current date and time
    const today = new Date();
    invoiceDate.textContent = `Date: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`;

    // calculate subtotal and display  item
    let subtotal = 0;
    cart.forEach(item => {
        const itemSubtotal = item.price * item.qty;
        subtotal += itemSubtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${itemSubtotal.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    // calculate tax and total
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    // display 
    subtotalField.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    taxField.textContent = `Tax (10%): $${tax.toFixed(2)}`;
    totalField.textContent = `Total: $${total.toFixed(2)}`;

    // print invoice and clear cart
    printButton.addEventListener("click", () => {
        window.print();
    
        // 
        const registerArr = JSON.parse(localStorage.getItem("RegistrationData")) || [];
        const register = registerArr[0]; 

        //  invoice object 
        const newInvoice = {
            trn: register.trn,
            date: today.toLocaleDateString() + " " + today.toLocaleTimeString(),
            items: cart,
            subtotal: subtotal,
            tax: tax,
            total: total
        };

        let all = JSON.parse(localStorage.getItem("AllInvoices")) || [];
        all.push(newInvoice);
        localStorage.setItem("AllInvoices", JSON.stringify(all));

        localStorage.removeItem("cart"); 
    });
});

//show invoice
function ShowInvoices() {
    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    const resultsContainer = document.getElementById("invoice-results-container"); 

    console.log("---- ALL INVOICES ----", allInvoices);

    const searchTRN = prompt("Enter TRN to search for invoice:");
    if (searchTRN) { 
        const results = allInvoices.filter(inv => inv.trn == searchTRN);

        if (results.length > 0) {
            let html = `<h3>Search Results for TRN: ${searchTRN}</h3>`;
            results.forEach((inv, index) => {
                html += `
                    <div class="invoice-result">
                        <h4>Invoice #${index + 1} (${inv.date})</h4>
                        <p>Total: $${inv.total.toFixed(2)}</p>
                        <p>Items: ${inv.items.length}</p>
                    </div>
                `;
            });
            if (resultsContainer) resultsContainer.innerHTML = html;
        } else {
            if (resultsContainer) resultsContainer.innerHTML = `<p>No invoice found for TRN: ${searchTRN}</p>`;
        }
    } else {
        if (resultsContainer) resultsContainer.innerHTML = "";
    }
}

function GetUserInvoices() {
    const resultsContainer = document.getElementById("invoice-results-container");

    //  currently logged-in user
    const userDataArr = JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const userData = userDataArr[0]; 

    if (!userData || !userData.trn) {
        if (resultsContainer) resultsContainer.innerHTML = `<p>Error: No logged-in user found.</p>`;
        console.log("No logged-in user found.");
        return;
    }

    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    const userInvoices = allInvoices.filter(inv => inv.trn == userData.trn);

    if (userInvoices.length > 0) {
        let html = `<h3>Your Invoices (TRN: ${userData.trn})</h3>`;
        userInvoices.forEach((inv, index) => {
            html += `
                <div class="invoice-result">
                    <h4>Invoice #${index + 1} (${inv.date})</h4>
                    <p>Total: $${inv.total.toFixed(2)}</p>
                    <p>Items: ${inv.items.length}</p>
                </div>
            `;
        });
        if (resultsContainer) resultsContainer.innerHTML = html;
    } else {
        if (resultsContainer) resultsContainer.innerHTML = `<p>You have no saved invoices.</p>`;
    }
}
