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
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  let goals = [];
  let student = {};
  let objectives = [];
  var dataRef = database.ref('studentData');
  dataRef.on('value', function(snapshot) { // Use 'on' instead of 'once' to listen for changes in real-time
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      let array = Papa.parse(childData, { header: false }).data;
      array.splice(array.length - 1, 1);

      if (id >= 0 && id < array.length) {
        student = {
          firstname: array[id][0],
          lastname: array[id][1],
          studentId: array[id][2],
          gradeLevel: array[id][3],
          primaryDisability: array[id][4],
          caseManager: array[id][5],
          lastAnnualReview: array[id][6]
        };

        var details = document.getElementById("details");
        details.innerHTML = student.firstname + " " + student.lastname + " " + student.studentId;

        var goalDataRef = database.ref(id + 'goals');
        goalDataRef.on('value', function(goalSnapshot) { // Use 'on' instead of 'once' to listen for changes in real-time
          goals = []; // Clear the goals array before updating
          goalSnapshot.forEach(function(goalChildSnapshot) {
            var goalChildData = goalChildSnapshot.val();

            if (goalChildData === null) {
              goals.push({
                name: "Sample Goal",
                category: "Math",
                progress: "0/0",
                notes: "",
                lastUpdated: new Date().toLocaleDateString()
              });
            } else {
              let goalsarray = Papa.parse(goalChildData, { header: false }).data;
              goalsarray.splice(goalsarray.length - 1, 1);
              goalsarray.forEach((goal) => {
                goals.push({
                  name: goal[0],
                  category: goal[1],
                  progress: goal[2],
                  notes: goal[3],
                  lastUpdated: new Date(goal[4]).toLocaleDateString()
                });
              });
            }
          });
          renderGoals();
        });
      } else {
        alert("Invalid student ID");
      }
    });
  });
  // Function to render the goals list
  function renderGoals() {
    const goalsList = document.getElementById("goals-list");
    goalsList.innerHTML = "";
    
    goals.forEach((goal, index) => {
      var objDataRef = database.ref(id + "," + index + "objectives");
      objDataRef.on('value', function(objSnapshot) { // Use 'on' instead of 'once' to listen for changes in real-time
        objectives = []; // Clear the goals array before updating
        objSnapshot.forEach(function(objChildSnapshot) {
          var objChildData = objChildSnapshot.val();
          if(objChildData !== null){
            objectives = Papa.parse(objChildData, { header: false }).data;
          } else {
            objectives = null;
          }
          let progress = "";
          if (objectives === null || objectives === "") {
            progress = "0/0";
          } else {
            let num = 0;
            let den = 0;
            // Remove the last empty element from the array
            objectives.splice(objectives.length - 1, 1);

            // Convert each line of data into an objective object and add it to the objectives array
            objectives.forEach((objective) => {
              if(objective[1] === "Completed") {
                num++;
              }
              den++;
            });
            progress = num+"/"+den;
          }
          goal.progress = progress;
        });
      });
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <button onclick="editGoal(${index})">Edit</button>
        </td>
        <td>
          <a href="objectives?id=${id}&goalId=${index}" class="goal-link">${goal.name}</a>
        </td>
        <td>${goal.category}</td>
        <td>${goal.progress}</td>
        <td>
          <textarea rows="2" cols="20" onchange="updateNotes(${index}, this.value)" id="edit-notes-${index}">${goal.notes}</textarea>
        </td>
        <td>${goal.lastUpdated}</td>
      `;
      goalsList.appendChild(row);
    });

    let goals2D = [];

    goals.forEach((goal) => {
      goals2D.push([
        goal.name,
        goal.category,
        goal.progress,
        goal.notes,
        goal.lastUpdated
      ]);
    });
    exportToCsv(goals2D, 0);
  }

  // Function to add a new goal
  function addGoal(event) {
    event.preventDefault();
    const name = document.getElementById("add-name").value;
    const category = document.getElementById("add-category").value;
    database.ref(id + "," + goals.length + "objectives").child("data").set("Sample Objective,Not started,,"+new Date().toLocaleDateString());
    // Create a new goal object
    const goal = {
      name: name,
      category: category,
      progress: "0/0",
      notes: "",
      lastUpdated: new Date().toLocaleDateString()
    };

    goals.push(goal);
    renderGoals();

    // Reset the form
    document.getElementById("add-goal-form").reset();
  }

  // Function to edit a goal
  function editGoal(index) {
    const goalsList = document.getElementById("goals-list");
    goalsList.innerHTML = "";

    goals.forEach((goal, goalIndex) => {
      const row = document.createElement("tr");

      if (goalIndex === index) {
        row.innerHTML = `
          <td>
            <button onclick="replaceGoal(${index})">Confirm</button>
            <button onclick="deleteGoal(${index})">Delete</button>
          </td>
          <td>
            <input type="text" value="${goal.name}" id="edit-name-${index}" required>
          </td>
          <td>
            <input type="text" value="${goal.category}" id="edit-category-${index}" required>
          </td>
          <td>${goal.progress}</td>
          <td>
            <textarea rows="2" cols="20" id="edit-notes-${goalIndex}">${goal.notes}</textarea>
          </td>
          <td>${goal.lastUpdated}</td>
        `;
      } else {
        row.innerHTML = `
          <td>
            <button onclick="editGoal(${goalIndex})">Edit</button>
          </td>
          <td>${goal.name}</td>
          <td>${goal.category}</td>
          <td>${goal.progress}</td>
          <td>
            <textarea rows="2" cols="20" id="edit-notes-${goalIndex}" readonly>${goal.notes}</textarea>
          </td>
          <td>${goal.lastUpdated}</td>
        `;
      }

      goalsList.appendChild(row);
    });
  }

  // Function to replace goal data
  function replaceGoal(index) {
    const name = document.getElementById(`edit-name-${index}`).value;
    const category = document.getElementById(`edit-category-${index}`).value;
    const notes = document.getElementById(`edit-notes-${index}`).value;

    goals[index] = {
      name: name,
      category: category,
      progress: goals[index].progress,
      notes: notes,
      lastUpdated: new Date().toLocaleDateString()
    };

    renderGoals();
  }

  // Function to delete a goal
  function deleteGoal(index) {
    goals.splice(index, 1);
    renderGoals();
  }

  // Function to update notes
  function updateNotes(index, value) {
    goals[index].notes = value;
    goals[index].lastUpdated = new Date().toLocaleDateString();
    renderGoals();
  }

  // Function to export data to CSV
  function exportData(event) {
    event.preventDefault();
    let goals2D = [];
    goals2D.push([student.firstname,student.lastname,student.studentId,student.gradeLevel,student.primaryDisability,student.caseManager,student.lastAnnualReview]);
    goals.forEach((goal) => {
      goals2D.push([
        goal.name,
        goal.category,
        goal.progress,
        goal.notes,
        goal.lastUpdated
      ]);
    });
    exportToCsv(goals2D, 1);
  }

  function exportToCsv(rows, download) {
    var processRow = function (row) {
      var finalVal = "";
      for (var j = 0; j < row.length; j++) {
        var innerValue = row[j] === null ? "" : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleDateString();
        }
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) {
          result = '"' + result + '"';
        }
        if (j > 0) {
          finalVal += ",";
        }
        finalVal += result;
      }
      return finalVal + "\n";
    };
    var csvFile = "";
    for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    if (download == 1) {
      // Check if the browser supports the HTML5 download attribute
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "students.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (navigator.msSaveBlob) {
        // For IE 10+
        var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
        navigator.msSaveBlob(blob, "students.csv");
      }
    } else {
      database.ref(id + "goals").child("data").set(csvFile);
    }
  }

  // Event listener for the form submission
  document.getElementById("export-student-data").addEventListener("submit", exportData);
  document.getElementById("add-goal-form").addEventListener("submit", addGoal);
  document.getElementById("back-student").addEventListener("click", function() {
    window.location.href = "https://zephyrphs.github.io/Studata/database/";
  });
} else {
  alert("Your session has expired. Please log in again.");
}
