if (sessionStorage.getItem("token") === "adminpassword") {
  // Retrieve the student's ID from the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  // Retrieve the student object based on the ID
  let data = localStorage.getItem("data");
  let array = Papa.parse(data, { header: false }).data;

  // Remove the last empty element from the array
  array.splice(array.length - 1, 1);

  // Check if the ID is within the valid range
  if (id >= 0 && id < array.length) {
    const student = {
      firstname: array[id][0],
      lastname: array[id][1],
      studentId: array[id][2]
    };

    // Display the additional details
    var details = document.getElementById("details");
    details.innerHTML = student.firstname + " " + student.lastname + " " + student.studentId;

    let goals = [];

    // Check if data exists in localStorage
    if (localStorage.getItem(id + "goals") === null || localStorage.getItem(id + "goals") === "") {
      // If no data exists, add a sample goal
      goals.push({
        name: "Sample Goal",
        category: "Math",
        progress: "0/0",
        notes: "",
        lastUpdated: new Date().toLocaleDateString()
      });
    } else {
      // If data exists, retrieve and parse it
      let goalsdata = localStorage.getItem(id + "goals");
      let goalsarray = Papa.parse(goalsdata, { header: false }).data;
      
      // Remove the last empty element from the array
      goalsarray.splice(goalsarray.length - 1, 1);

      // Convert each line of data into a goal object and add it to the goals array
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

    // Function to render the goals list
    function renderGoals() {
      const goalsList = document.getElementById("goals-list");
      goalsList.innerHTML = "";

      goals.forEach((goal, index) => {
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

      exportToCsv(goals2D);
    }

    // Function to add a new goal
    function addGoal(event) {
      event.preventDefault();
      const name = document.getElementById("add-name").value;
      const category = document.getElementById("add-category").value;

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
      localStorage.setItem(id + "goals", csvFile);
    }

    // Event listener for the form submission
    document.getElementById("export-student-data").addEventListener("submit", exportData);
    document.getElementById("add-goal-form").addEventListener("submit", addGoal);

    // Initial rendering of the goals list
    renderGoals();
  } else {
    alert("Invalid student ID");
  }
} else {
  alert("Your session has expired. Please log in again.");
}
