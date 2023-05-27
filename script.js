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
      // Perform login logic (work in progress)
      if (username === 'admin' && password === 'password') {
        sessionStorage.setItem("token", username+password);
        window.location.href = '/Studata/database';
      } else {
        alert('Invalid username or password. Please try again.');
      }
    }
  });
});
