document.addEventListener("DOMContentLoaded", () => {
    // get logout button
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        //  logout click
        logoutBtn.addEventListener("click", () => {
            const currentUser = localStorage.getItem("currentUser");

            // check if someone is logged in
            if (!currentUser) {
                alert("You are not logged in.");
                return;
            }

            // remove current user from localStorage
            localStorage.removeItem("currentUser");
            alert("You have been logged out.");

            // redirect to login page
            window.location.href = "login.html";
        });
    }
});
