document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    axios.post('/login', { username: username, password: password })
    .then(function(response) {
        console.log('Login successful');
    })
    .catch(function(error) {
        console.error('Login failed', error);
    });
});
