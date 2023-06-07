if (sessionStorage.getItem("token") === "adminpassword") {
  var firebaseConfig = {
    apiKey: "AIzaSyDaGflOJidMjEghcK9xpqYBH6YI-nOSuvw",
    authDomain: "zephyr-studata.firebaseapp.com",
    databaseURL: "https://zephyr-studata-default-rtdb.firebaseio.com",
    projectId: "zephyr-studata",
    storageBucket: "zephyr-studata.appspot.com",
    messagingSenderId: "236682966409",
    appId: "1:236682966409:web:96428f11dff8fa4f751d58",
    measurementId: "G-NEPJNZ2VC2"
  };
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  // Session student data
  let students = [];

  var dataRef = database.ref('studentData');
  dataRef.on('value', function(snapshot) {
    students = []; // Clear existing student data
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();

      // Check if data exists in localStorage
      if (childData === "" || childData === null) {
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
        let data = childData;
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
    });
    renderStudents();
  });

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
    exportToCsv(students2D);
  }

  // Rest of the code...
} else {
  alert("Your session has expired. Please log in again.");
}
