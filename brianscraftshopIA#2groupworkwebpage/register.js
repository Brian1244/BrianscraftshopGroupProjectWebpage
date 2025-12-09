document.addEventListener("DOMContentLoaded", function() {

    // get the registration form
    const registerForm = document.querySelector("form");

    // handle form submission
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault(); 
        // get input values
        const name = document.getElementById("name").value;
        const dob = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value;
        const phone = document.getElementById("tele").value.trim();
        const trn = document.getElementById("trn").value.trim();
        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Load registration data array 
        let registrationData = JSON.parse(localStorage.getItem("RegistrationData")) || [];

        // check if all fields are filled
        if (!name || !dob || !email || !username || !password) {
            alert("Please fill in all fields!");
            return;
        }

        //Check for existing username 
        const usernameExists = registrationData.some(
            (storedUser) => storedUser.username === username
        );

        if (usernameExists) {
            alert("Username already exists! Choose another one.");
            return;
        }

        // NEW FEATURES FOR GROUP PROJECT

        // Password greater than or 8 characters
        if (password.length < 8) {
            alert("Password must be at least 8 characters long!");
            return;
        }

        // trn match format 
        const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
        if (!trnPattern.test(trn)) {
            alert("TRN must be in the format 000-000-000");
            return;
        }

        // check for trn
        const trnExists = registrationData.some(
            (storedUser) => storedUser.trn === trn
        );

        if (trnExists) {
            alert("TRN already exists! Please check your TRN.");
            return;
        }

        // Age must be 18 and older
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            alert("You must be at least 18 years old to register.");
            return;
        }

        // create user object
        const user = {
            name,
            dob,
            gender,
            phone,
            email,
            trn,
            username,
            password
        };

        // save new user 
        registrationData.push(user);
        localStorage.setItem("RegistrationData", JSON.stringify(registrationData));

        // save new user for all-time tracking
        let allUsers = JSON.parse(localStorage.getItem("AllUsers")) || [];
        allUsers.push(user);
        localStorage.setItem("AllUsers", JSON.stringify(allUsers));

        alert("Registration successful! You can now log in.");

        // reset form
        registerForm.reset(); 
        
        // redirect to login page
        window.location.href = "login.html";
    });

});