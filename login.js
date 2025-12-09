document.addEventListener("DOMContentLoaded", function() {

    // get the login form
    const loginForm = document.getElementById("login-form"); // CHANGED

    // handle form submission
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault(); 

        // get input values
        const trnInput = document.getElementById("trn").value.trim(); 
        const password = document.getElementById("password").value;

        // get stored user data from localStorage
        
        const registrationData = JSON.parse(localStorage.getItem("RegistrationData")) || [];

        // vlaidation for trn
        // >>> FIXED <<< find the user object by trn correctly
        const storedUser = registrationData.find(user => user.trn === trnInput);

        //  initialize failed attempts tracker in localStorage
        let failCounts = JSON.parse(localStorage.getItem("loginFailCounts")) || {};

        // check if trn exists
        if (!storedUser) {
            alert("TRN not found! Please register first.");
            return;
        }

        // Check if user is locked
        if (failCounts[trnInput] && failCounts[trnInput] >= 3) {
            alert("Account locked due to 3 failed login attempts.");
            return; 
        }

        // check password
        
        if (storedUser.password === password) {
            alert("Welcome back, " + storedUser.name + "!"); 
            // save current user
            localStorage.setItem("currentUser", storedUser.username);

            // reset fail count on successful login
            failCounts[trnInput] = 0;
            localStorage.setItem("loginFailCounts", JSON.stringify(failCounts));

            
            localStorage.setItem("RegistrationData", JSON.stringify([storedUser]));

            // redirect to home
            window.location.href = "index.html";
        } else {

            // fail count
            if (!failCounts[trnInput]) {
                failCounts[trnInput] = 1;
            } else {
                failCounts[trnInput]++;
            }
            localStorage.setItem("loginFailCounts", JSON.stringify(failCounts));

            // alert
            const remaining = 3 - failCounts[trnInput];
            if (remaining > 0) {
                alert("Incorrect password. You have " + remaining + " attempt(s) left."); // CHANGED from template literal
            } else {
                alert("Incorrect password. Your account is now locked due to 3 failed attempts.");
            }
        }
    });

});
