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
  if(id>=0){
    students.splice(id,1);
    renderStudents();
  }

  // Reset the form
  document.getElementById("delete-student-form").reset();
}
function exportData(event) {
  event.preventDefault();
  let students2D = [];
  students.forEach((student) => {
    students2D.push([student.name, student.studentId]);
  });
  exportToCsv("students.csv",students2D);
}
function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Event listener for the form submission
document.getElementById("export-student-data").addEventListener("submit", exportData);
document.getElementById("add-student-form").addEventListener("submit", addStudent);
document.getElementById("delete-student-form").addEventListener("submit", deleteStudent);

// Initial rendering of the student list
renderStudents();
