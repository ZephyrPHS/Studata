if (sessionStorage.getItem("token") === "adminpassword") {
  // Session student data
  let students = [];

  // Check if data exists in localStorage
  if (localStorage.getItem("data") === "" || localStorage.getItem("data") === null) {
    // If no data exists, add a sample student
    students.push({ 
      firstname: "Sample",
      lastname: "Name",
      studentId: "000000",
      gradeLevel: "9",
      primaryDisability: "SLD",
      caseManager: "admin",
      lastAnnualReview: new Date().toLocaleDateString()
    });
  } else {
    // If data exists, retrieve and parse it
    let data = localStorage.getItem("data");
    let array = Papa.parse(data, { header: false }).data;
    // Remove the last empty element from the array
    array.splice(array.length - 1, 1);
    // Convert each line of data into a student object and add it to the students array
    array.forEach((student) => {
      students.push({
        firstname: student[0],
        lastname: student[1],
        studentId: student[2],
        gradeLevel: student[3],
        primaryDisability: student[4],
        caseManager: student[5],
        lastAnnualReview: student[6]
      });
    });
  }

  // Function to render the student list
  function renderStudents() {
    const studentList = document.getElementById("student-list");
    studentList.innerHTML = "";
    let id = 0;
    let students2D = [];
    students.forEach((student) => {
      students2D.push([
        student.firstname,
        student.lastname,
        student.studentId,
        student.gradeLevel,
        student.primaryDisability,
        student.caseManager,
        student.lastAnnualReview
      ]);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <form id="edit">
            <button onclick="editStudent(${id})">Edit</button>
          </form>
        </td>
        <td>
          <a href="goals?id=${id}" class="student-link">${student.firstname} ${student.lastname}</a>
        </td>
        <td>${student.studentId}</td>
        <td>${student.gradeLevel}</td>
        <td>${student.primaryDisability}</td>
        <td>${student.caseManager}</td>
        <td>${student.lastAnnualReview}</td>
      `;
      studentList.appendChild(row);
      id++;
    });
    exportToCsv("students.csv", students2D, 0);
  }

  // Function to edit a student
  function editStudent(editId) {
    const studentList = document.getElementById("student-list");
    studentList.innerHTML = "";
    let id = 0;
    students.forEach((student) => {
      const row = document.createElement("tr");
      if (id == editId) {
        row.innerHTML = `
          <form id="activeEdit">
            <td>
              <button onclick="replace(${id}, document.getElementById('firstname').value, document.getElementById('lastname').value, document.getElementById('studentId').value, document.getElementById('gradeLevel').value, document.getElementById('primaryDisability').value)">Confirm</button>
              <button onclick="deleteStudent(${id})">Delete</button>
            </td>
            <td>
              <input type="text" value="${students[id].firstname}" id="firstname" />
              <input type="text" value="${students[id].lastname}" id="lastname" />
            </td>
            <td>
              <input type="text" value="${students[id].studentId}" id="studentId" />
            </td>
            <td>
              <select id="gradeLevel">
                <option value="9" ${students[id].gradeLevel === "9" ? "selected" : ""}>9</option>
                <option value="10" ${students[id].gradeLevel === "10" ? "selected" : ""}>10</option>
                <option value="11" ${students[id].gradeLevel === "11" ? "selected" : ""}>11</option>
                <option value="12" ${students[id].gradeLevel === "12" ? "selected" : ""}>12</option>
              </select>
            </td>
            <td>
               <input type="text" value="${students[id].primaryDisability}" id="primaryDisability" />
            </td>
            <td>${student.caseManager}</td>
            <td>
               <input type="text" value="${student.lastAnnualReview}" id="lastAnnualReview" />
            </td>
          </form>
        `;
      } else {
        row.innerHTML = `
          <td>
            <form id="edit">
              <button onclick="editStudent(${id})">Edit</button>
            </form>
          </td>
          <td>${student.firstname} ${student.lastname}</td>
          <td>${student.studentId}</td>
          <td>${student.gradeLevel}</td>
          <td>${student.primaryDisability}</td>
          <td>${student.caseManager}</td>
          <td>${student.lastAnnualReview}</td>
        `;
      }
      studentList.appendChild(row);
      id++;
    });
  }

  // Function to replace student data
  function replace(id, firstname, lastname, studentId, gradeLevel, primaryDisability) {
    students[id] = {
      firstname: firstname,
      lastname: lastname,
      studentId: studentId,
      gradeLevel: gradeLevel,
      primaryDisability: primaryDisability,
      caseManager: students[id].caseManager,
      lastAnnualReview: students[id].lastAnnualReview
    };
    renderStudents();
  }

  // Function to add a new student
  function addStudent(event) {
    event.preventDefault();
    localStorage.setItem(students.length+"goals", "");
    const firstname = document.getElementById("add-first-name").value;
    const lastname = document.getElementById("add-last-name").value;
    const studentId = document.getElementById("add-studentId").value;
    const gradeLevel = document.getElementById("add-gradeLevel").value;
    const primaryDisability = document.getElementById("add-primaryDisability").value;
    // Create a new student object
    const student = {
      firstname: firstname,
      lastname: lastname,
      studentId: studentId,
      gradeLevel: gradeLevel,
      primaryDisability: primaryDisability,
      caseManager: "admin",
      lastAnnualReview: new Date().toLocaleDateString()
    };
    students.push(student);
    renderStudents();
    // Reset the form
    document.getElementById("add-student-form").reset();
  }

  // Function to delete a student
  function deleteStudent(id) {
    event.preventDefault();
    if (id >= 0) {
      students.splice(id, 1);
      renderStudents();
    }
  }

  // Function to export data to CSV
  function exportData(event) {
    event.preventDefault();
    let students2D = [];
    students.forEach((student) => {
      students2D.push([
        student.firstname,
        student.lastname,
        student.studentId,
        student.gradeLevel,
        student.primaryDisability,
        student.caseManager,
        student.lastAnnualReview
      ]);
    });
    exportToCsv("students.csv", students2D, 1);
  }

  // Function to export data to CSV format and save it to localStorage
  function exportToCsv(filename, rows, download) {
    var processRow = function (row) {
      var finalVal = "";
      for (var j = 0; j < row.length; j++) {
        var innerValue = row[j] === null ? "" : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ",";
        finalVal += result;
      }
      return finalVal + "\n";
    };

    var csvFile = "";
    for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    localStorage.setItem("data", csvFile);

    if (download == 1) {
      // Check if the browser supports the HTML5 download attribute
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (navigator.msSaveBlob) {
        // For IE 10+
        var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
        navigator.msSaveBlob(blob, filename);
      }
    }
  }

  // Event listener for the form submission
  document.getElementById("export-student-data").addEventListener("submit", exportData);
  document.getElementById("add-student-form").addEventListener("submit", addStudent);

  // Initial rendering of the student list
  renderStudents();
}else{
  alert("Your session has expired. Please log in again.");
}
