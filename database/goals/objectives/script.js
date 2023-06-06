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
  // Retrieve the student's ID from the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const goalId = urlParams.get("goalId");
  let objectives = [];
  let goal = {};
  let student = {};
  var dataRef = database.ref('studentData');
  dataRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      let array = Papa.parse(childData, { header: false }).data;
  
      // Remove the last empty element from the array
      array.splice(array.length - 1, 1);

      // Check if the ID is within the valid range
      if (id >= 0 && id < array.length) {

        // Retrieve the goal object based on the ID
        var goalDataRef = database.ref(id+'goals');
        goalDataRef.once('value', function(goalSnapshot) {
          goalSnapshot.forEach(function(goalChildSnapshot) {
            var goalChildData = goalChildSnapshot.val();
            let goalsarray = Papa.parse(goalChildData, { header: false }).data; 

            if (goalId >= 0 && goalId < goalsarray.length) {
              // Remove the last empty element from the array
              goalsarray.splice(array.length - 1, 1);

              student = {
                firstname: array[id][0],
                lastname: array[id][1],
                studentId: array[id][2]
              };
              goal = {
                name: goalsarray[goalId][0],
              };

              // Display the additional details
              var details = document.getElementById("details");
              details.innerHTML = student.firstname + " " + student.lastname + " " + student.studentId + " " + goal.name;


              var objectiveDataRef = database.ref(id + "," + goalId + "objectives");
              objectiveDataRef.once('value', function(objectiveSnapshot) {
                objectiveSnapshot.forEach(function(objectiveChildSnapshot) {
                  var objectiveChildData = objectiveChildSnapshot.val();
                  // Check if data exists in localStorage
                  if (objectiveChildData === null && objectiveChildData === "") {
                    // If no data exists, add a sample objective
                    objectives.push({
                      name: "Sample Objective",
                      progress: "Not started",
                      notes: "",
                      lastUpdated: new Date().toLocaleDateString()
                    });
                  } else {
                    // If data exists, retrieve and parse it
                    let objectivesarray = Papa.parse(objectiveChildData, { header: false }).data;

                    // Remove the last empty element from the array
                    objectivesarray.splice(objectivesarray.length - 1, 1);

                    // Convert each line of data into an objective object and add it to the objectives array
                    objectivesarray.forEach((objective) => {
                      objectives.push({
                        name: objective[0],
                        progress: objective[1],
                        notes: objective[2],
                        lastUpdated: new Date(objective[3]).toLocaleDateString()
                      });
                    });
                  }
                  renderObjectives();
                });
              });
            } else {
            alert("Invalid goal ID");
            }
          });
        });
      } else {
        alert("Invalid student ID");
      }
    });
  });
    // Function to render the objectives list
    function renderObjectives() {
      const objectivesList = document.getElementById("objectives-list");
      objectivesList.innerHTML = "";

      objectives.forEach((objective, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>
            <button onclick="editObjective(${index})">Edit</button>
          </td>
          <td>${objective.name}</td>
          <td>${objective.progress}</td>
          <td>
            <textarea rows="2" cols="20" onchange="updateNotes(${index}, this.value)" id="edit-notes-${index}">${objective.notes}</textarea>
          </td>
          <td>${objective.lastUpdated}</td>
        `;
        objectivesList.appendChild(row);
      });

      let objectives2D = [];

      objectives.forEach((objective) => {
        objectives2D.push([
          objective.name,
          objective.progress,
          objective.notes,
          objective.lastUpdated
        ]);
      });

      exportToCsv(objectives2D);
    }

    // Function to add a new objective
    function addObjective(event) {
      event.preventDefault();
      const name = document.getElementById("add-name").value;

      // Create a new objective object
      const objective = {
        name: name,
        progress: "Not started",
        notes: "",
        lastUpdated: new Date().toLocaleDateString()
      };

      objectives.push(objective);
      renderObjectives();

      // Reset the form
      document.getElementById("add-objective-form").reset();
    }

    // Function to edit an objective
    function editObjective(index) {
      const objectivesList = document.getElementById("objectives-list");
      objectivesList.innerHTML = "";

      objectives.forEach((objective, objectiveIndex) => {
        const row = document.createElement("tr");

        if (objectiveIndex === index) {
          row.innerHTML = `
            <td>
              <button onclick="replaceObjective(${index})">Confirm</button>
              <button onclick="deleteObjective(${index})">Delete</button>
            </td>
            <td>
              <input type="text" value="${objective.name}" id="edit-name-${index}" required>
            </td>
            <td>
              <select id="edit-progress-${index}">
                <option value="Not started" ${objectives[index].progress === "Not started" ? "selected" : ""}>Not started</option>
                <option value="In progress" ${objectives[index].progress === "In progress" ? "selected" : ""}>In progress</option>
                <option value="Completed" ${objectives[index].progress === "Completed" ? "selected" : ""}>Completed</option>
              </select>
            </td>
            <td>
              <textarea rows="2" cols="20" id="edit-notes-${objectiveIndex}">${objective.notes}</textarea>
            </td>
            <td>${objective.lastUpdated}</td>
          `;
        } else {
          row.innerHTML = `
            <td>
              <button onclick="editObjective(${objectiveIndex})">Edit</button>
            </td>
            <td>${objective.name}</td>
            <td>${objective.progress}</td>
            <td>
              <textarea rows="2" cols="20" id="edit-notes-${objectiveIndex}" readonly>${objective.notes}</textarea>
            </td>
            <td>${objective.lastUpdated}</td>
          `;
        }

        objectivesList.appendChild(row);
      });
    }

    // Function to replace objective data
    function replaceObjective(index) {
      const name = document.getElementById(`edit-name-${index}`).value;
      const notes = document.getElementById(`edit-notes-${index}`).value;
      const progress = document.getElementById(`edit-progress-${index}`).value;

      objectives[index] = {
        name: name,
        progress: progress,
        notes: notes,
        lastUpdated: new Date().toLocaleDateString()
      };

      renderObjectives();
    }

    // Function to delete an objective
    function deleteObjective(index) {
      objectives.splice(index, 1);
      renderObjectives();
    }

    // Function to update notes
    function updateNotes(index, value) {
      objectives[index].notes = value;
      objectives[index].lastUpdated = new Date().toLocaleDateString();
      renderObjectives();
    }

    function exportToCsv(rows) {
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
      database.ref(id + "," + goalId + "objectives").child("data").set(csvFile);
      localStorage.setItem(id + "," + goalId + "objectives", csvFile);
    }

    // Event listener for the form submission
    document.getElementById("add-objective-form").addEventListener("submit", addObjective);
    document.getElementById("back-goal").addEventListener("click", function() {
      window.location.href = "https://zephyrphs.github.io/Studata/database/goals/?id="+id;
    });
} else {
  alert("Your session has expired. Please log in again.");
}
