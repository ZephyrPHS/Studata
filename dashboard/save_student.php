<?php
// Retrieve the student data from the request
$id = $_POST['id'];
$name = $_POST['name'];
$number = $_POST['number'];

// Connect to the database
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "studentdb";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Insert the student data into the database
$sql = "INSERT INTO students (id, name, number) VALUES ('$id', '$name', '$number')";

if ($conn->query($sql) === TRUE) {
    echo "Student added successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
