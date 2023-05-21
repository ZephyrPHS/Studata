// Function to add a new student
function addStudent(event) {
  event.preventDefault();

  const id = document.getElementById("student-id").value;
  const name = document.getElementById("student-name").value;
  const number = document.getElementById("student-number").value;

  // Create a new student object
  const student = {
    id: id,
    name: name,
    number: number,
  };

  // Send the student data to the server-side script
  fetch("save_student.php", {
    method: "POST",
    body: JSON.stringify(student),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      // Refresh the student list after successful addition
      renderStudents();
      // Reset the form
      document.getElementById("add-student-form").reset();
    })
    .catch((error) => console.log(error));
}
