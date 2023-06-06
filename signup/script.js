// CHECK TO SEE IF USERNAME AND PASSWORD ALREADY EXISTS
// IF NOT, REGISTER ACCOUNT
document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const loginForm = document.querySelector('.the-form');
  
    // Add event listener for form submission
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      // Get the values from the input fields
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      // Perform validation
      if (username.trim() === '' || password.trim() === '') {
        alert('Please enter both username and password.');
      } else {
        // perform account creation logic
        if (!(username === "admin") && !(password === "password")) { // "admin" and "password" should be all existing usernames and passwords
          alert('Account creation request has been sent to the RTSE and is waiting approval. You may close this page.'); // send request to RTSE
        }
        else {
          alert('This username already exists, please enter a new username.');
        }
      }
    });
  });