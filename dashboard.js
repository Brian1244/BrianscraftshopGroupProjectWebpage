document.addEventListener("DOMContentLoaded", () => {
    // The 'show-user-frequency' button uses an inline onclick handler in the HTML.
    const showBtn = document.getElementById("show-all-invoices");
    const myBtn = document.getElementById("my-invoices");

    if (showBtn) showBtn.addEventListener("click", ShowInvoices);
    if (myBtn) myBtn.addEventListener("click", GetUserInvoices);
});

//  HELPER FUNCTIONS

/**
 * Creates a simple, CSS-based bar chart display.
 * @param {Object} data - Key-value pairs of categories and their counts 
 * @returns {string} HTML string for the bar chart.
 */
function createBarChartHTML(title, data) {
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);
    let html = `<h3>${title} (Total Users: ${total})</h3>`;
    html += '<div class="bar-chart-container">';

    for (const [category, count] of Object.entries(data)) {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        html += `
            <div class="bar-chart-item">
                <span class="category-label">${category} (${count})</span>
                <div class="bar-wrapper">
                    <div class="bar" style="width: ${percentage.toFixed(0)}%;"></div>
                    <span class="percentage-label">${percentage.toFixed(0)}%</span>
                </div>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

/*
  Helper function to display a list of invoices.
 */
function displayInvoiceList(invoices, container, title) {
    let html = `<h3>${title}</h3>`;

    if (invoices.length === 0) {
        container.innerHTML = `<p>No invoices found.</p>`;
        return;
    }

    // Creating a table for better visualization of invoice data
    html += `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Invoice ID</th>
                    <th>TRN</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Items</th>
                </tr>
            </thead>
            <tbody>
    `;

    invoices.forEach((inv, i) => {
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${inv.id || 'N/A'}</td>
                <td>${inv.trn || 'N/A'}</td>
                <td>${inv.date || 'N/A'}</td>
                <td>$${(inv.total ? inv.total.toFixed(2) : 'N/A')}</td>
                <td>${inv.items ? inv.items.length : 'N/A'}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}


//  Show User Frequency (Implements two visual 'bar charts') ---

function ShowUserFrequency() {
    // Specification: Use localStorage key called 'RegisterData' for users, 
    // but often a separate 'AllUsers' key is used for the full list. 
    // Assuming 'RegisterData' contains the array of all registered users for frequency analysis.
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || []; 
    const output = document.getElementById("user-frequency-results");

    if (users.length === 0) {
        output.innerHTML = "<p>No registered users found in RegistrationData.</p>";
        return;
    }

    //  Gender Frequency
    let genderCounts = { Male: 0, Female: 0, Other: 0 };

    //  Age Group Frequency
    let ageCounts = { '18-25': 0, '26-35': 0, '36-50': 0, '50+': 0 };

    const today = new Date();

    users.forEach(user => {
        // Count Gender (Male, Female, Other)
        const g = (user.gender || "").trim().toLowerCase();
        if (g === "male") genderCounts.Male++;
        else if (g === "female") genderCounts.Female++;
        else genderCounts.Other++; 

        // Calculate and Count Age Group
        const dob = new Date(user.dob);
        if (isNaN(dob)) return; 

        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age >= 18 && age <= 25) ageCounts['18-25']++;
        else if (age >= 26 && age <= 35) ageCounts['26-35']++;
        else if (age >= 36 && age <= 50) ageCounts['36-50']++;
        else if (age > 50) ageCounts['50+']++;
    });

    // Generate HTML for both 'bar charts'
    let html = createBarChartHTML("Gender Frequency", genderCounts);
    html += createBarChartHTML("Age Group Frequency", ageCounts);
    
    output.innerHTML = html;
}

//  Show Invoices (Display all and search using TRN with console logging) ---
function ShowInvoices() {
    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    const resultsContainer = document.getElementById("invoice-results-container");

    // Specification: Display all invoices and allow search. 
    // Also, log the search to console.log().
    console.log("---- ALL INVOICES AVAILABLE IN LOCALSTORAGE (AllInvoices) ----", allInvoices);

    if (allInvoices.length === 0) {
        resultsContainer.innerHTML = "<p>No invoices saved in AllInvoices.</p>";
        return;
    }

    const searchTRN = prompt("Enter TRN to search (Cancel to display ALL):");

    if (!searchTRN) {
        // Display ALL invoices if search is cancelled/empty
        displayInvoiceList(allInvoices, resultsContainer, "ALL Invoices");
        return;
    }

    // Filter based on searchTRN
    const results = allInvoices.filter(inv => (inv.trn || "").toString() === searchTRN.toString());

    // Specification: Log the search results using console.log()
    console.log(`---- INVOICES FOUND FOR TRN: ${searchTRN} ----`, results);

    if (results.length === 0) {
        resultsContainer.innerHTML = `<p>No invoice found for TRN: ${searchTRN}</p>`;
        return;
    }

    // Display filtered results
    displayInvoiceList(results, resultsContainer, `Invoices for TRN: ${searchTRN}`);
}

// Get User Invoices (References 'RegistrationData' for user TRN) ---
function GetUserInvoices() {
    const resultsContainer = document.getElementById("invoice-results-container");

    // Specification: Get TRN from the localStorage key called 'RegisterData'
    // Assuming 'RegisterData' stores the logged-in user object.
    const userData = JSON.parse(localStorage.getItem("RegistrationData")) || {}; 
    const userTRN = userData.trn;

    if (!userTRN) {
        resultsContainer.innerHTML = "<p>No logged-in user or TRN found in RegistrationData. Please ensure you are logged in.</p>";
        return;
    }

    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    // Filter invoices by the user's TRN
    const userInvoices = allInvoices.filter(inv => (inv.trn || "").toString() === userTRN.toString());

    if (userInvoices.length === 0) {
        resultsContainer.innerHTML = `<p>You have no invoices (TRN: ${userTRN}).</p>`;
        return;
    }

    // Display the user's invoices
    displayInvoiceList(userInvoices, resultsContainer, `Your Invoices (TRN: ${userTRN})`);
}