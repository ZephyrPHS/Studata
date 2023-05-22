// Sample student data
let students = [
  { name: "John Doe", studentId: "123456" },
  { name: "Jane Smith", studentId: "789012" },
];

// Function to render the student list
function renderStudents() {
  const studentList = document.getElementById("student-list");
  studentList.innerHTML = "";
  let id = 0;
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${id}</td>
      <td>${student.name}</td>
      <td>${student.studentId}</td>
    `;
    studentList.appendChild(row);
    id++;
  });
}

// Function to add a new student
function addStudent(event) {
  event.preventDefault();

  const name = document.getElementById("student-name").value;
  const studentId = document.getElementById("student-studentId").value;

  // Create a new student object
  const student = {
    name: name,
    studentId: studentId,
  };

  students.push(student);
  renderStudents();

  // Reset the form
  document.getElementById("add-student-form").reset();
}

function deleteStudent(event) {
  event.preventDefault();

  const id = document.getElementById("student-id-delete").value;
  if(parseInt(id).isInteger()&&id>=0){
    students.splice(id,1);
    renderStudents();
  }

  // Reset the form
  document.getElementById("delete-student-form").reset();
}

// Event listener for the form submission
document.getElementById("add-student-form").addEventListener("submit", addStudent);
document.getElementById("delete-student-form").addEventListener("submit", deleteStudent);

// Initial rendering of the student list
renderStudents();
