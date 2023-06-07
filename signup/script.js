// CHECK TO SEE IF USERNAME AND PASSWORD ALREADY EXISTS
// IF NOT, REGISTER ACCOUNT

// Function to check if a user already exists with the same email or username
function isDuplicateUser(users, email, username) {
  return users.some((user) => user.email === email || user.username === username);
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Perform validation
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === "" || email === "" || password === "") {
    alert("Please enter username, email, and password.");
    return;
  }

  // Retrieve existing users from local storage
  const existingUsersCSV = localStorage.getItem("users");
  const existingUsers2D = Papa.parse(existingUsersCSV).data;
  const existingUsers = [];

  // Convert existingUsers2D to an array of user objects
  for (let i = 0; i < existingUsers2D.length; i++) {
    const user = {
      username: existingUsers2D[i][0],
      email: existingUsers2D[i][1],
      password: existingUsers2D[i][2],
    };
    existingUsers.push(user);
  }

  // Check for duplicate email or username
  if (isDuplicateUser(existingUsers, email, username)) {
    alert("A user with the same email or username already exists.");
    return;
  }

  // Create a new user object
  const newUser = {
    username: username,
    email: email,
    password: password,
  };

  // Add the new user to the existing users array
  existingUsers.push(newUser);

  // Convert the updated users array back to CSV format
  const updatedUsersCSV = Papa.unparse(existingUsers);

  // Update the users in local storage
  localStorage.setItem("users", updatedUsersCSV);

  // Clear the form inputs
  usernameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";

  alert(
    "Account creation request has been sent to the RTSE and is waiting approval. You may close this page."
  ); // send request to RTSE
});
