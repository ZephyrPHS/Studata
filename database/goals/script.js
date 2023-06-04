if (sessionStorage.getItem("token") === "adminpassword") {
  // Retrieve the student's ID from the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  // Retrieve the student object based on the ID
  let data = localStorage.getItem("data");
  let array = data.split("\n").map(function (line) {
    return line.split(",");
  });
  // Remove the last empty element from the array
  array.splice(array.length - 1, 1);
  const student = { firstname: array[id][0], lastname: array[id][1], studentId: array[id][2] };
  // Display the additional details
  var details = document.getElementById("details");
  details.innerHTML = student.firstname + " " + student.lastname + " " + student.studentId;

  let goals = [];
  // Check if data exists in localStorage
  if (localStorage.getItem(id + "goals") == null) {
    // If no data exists, add a sample goal
    goals.push({ name: "Sample Goal", category: "Math", progress: "0/0", notes: "", lastUpdated: new Date().toLocaleString() });
  } else {
    // If data exists, retrieve and parse it
    let goalsdata = localStorage.getItem(id + "goals");
    let goalsarray = goalsdata.split("\n").map(function (line) {
      return line.split(",");
    });
    // Remove the last empty element from the array
    goalsarray.splice(goalsarray.length - 1, 1);
    // Convert each line of data into a goal object and add it to the goals array
    goalsarray.forEach((goal) => {
      goals.push({ name: goal[0], category: goal[1], progress: goal[2], notes: goal[3], lastUpdated: new Date(goal[4]) });
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
        <td>${goal.name}</td>
        <td>${goal.category}</td>
        <td>${goal.progress}</td>
        <td>
          <textarea rows="2" cols="20" onchange="updateNotes(${index}, this.value)">${goal.notes}</textarea>
        </td>
        <td>${goal.lastUpdated.toLocaleString()}</td>
      `;
      goalsList.appendChild(row);
    });
    let goals2D = [];
    goals.forEach((goal) => {
      goals2D.push([goal.name, goal.category, goal.progress, goal.notes, goal.lastUpdated.toLocaleString()]);
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
      lastUpdated: new Date().toLocaleString(),
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
            <button onclick="replaceGoal(${index}, document.getElementById('edit-name').value, document.getElementById('edit-category').value, document.getElementById('edit-notes').value)">Confirm</button>
            <button onclick="deleteGoal(${index})">Delete</button>
          </td>
          <td>
            <input type="text" value="${goal.name}" id="edit-name" required>
          </td>
          <td>
            <input type="text" value="${goal.category}" id="edit-category" required>
          </td>
          <td>${goal.progress}</td>
          <td>
            <textarea rows="2" cols="20" id="edit-notes">${goal.notes}</textarea>
          </td>
          <td>${goal.lastUpdated.toLocaleString()}</td>
        `;
      } else {
        row.innerHTML = `
          <td>
            <button onclick="editGoal(${goalIndex})">Edit</button>
          </td>
          <td>${goal.name}</td>
          <td>${goal.category}</td>
          <td>${goal.progress}</td>
          <td><textarea rows="2" cols="20" id="edit-notes">${goal.notes}</textarea></td>
          <td>${goal.lastUpdated.toLocaleString()}</td>
        `;
      }

      goalsList.appendChild(row);
    });
  }

  // Function to replace goal data
  function replaceGoal(index, name, category, notes) {
    goals[index] = {
      name: name,
      category: category,
      progress: goals[index].progress,
      notes: notes,
      lastUpdated: new Date().toLocaleString(),
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
    goals[index].lastUpdated = new Date().toLocaleString();
    renderGoals();
  }

  function exportToCsv(rows) {
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

    localStorage.setItem(id + "goals", csvFile);
  }

  // Event listener for the form submission
  document.getElementById("add-goal-form").addEventListener("submit", addGoal);

  // Initial rendering of the goals list
  renderGoals();
} else {
  alert("Your session has expired. Please log in again.");
}
