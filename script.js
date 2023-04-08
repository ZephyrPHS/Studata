document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const loginForm = document.querySelector('.the-form');

    // Add event listener for form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get the values from the input fields
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Perform validation (you can customize this based on your requirements)
        if (username.trim() === '' || password.trim() === '') {
            alert('Please enter both username and password.');
        } else {
            // Perform login logic (e.g., send request to server, etc.)
            // Replace the following lines with your actual login logic
            if (username === 'admin' && password === 'password123') {
                window.location.href = 'url';
            } else {
                alert('Invalid username or password. Please try again.');
            }
        }
    });
});
