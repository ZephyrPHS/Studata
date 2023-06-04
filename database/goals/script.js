if (sessionStorage.getItem("token") === "adminpassword") {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  let data = localStorage.getItem("data");
  let array = data.split("\n").map(function (line) {
    return line.split(",");
  });
  array.splice(array.length - 1, 1);
  const student = {
    firstname: array[id][0],
    lastname: array[id][1],
    studentId: array[id][2],
  };

  var details = document.getElementById("details");
  details.innerHTML = student.firstname + " " + student.lastname + " " + student.studentId;

  let goals = [];

  if (localStorage.getItem(id + "goals") == null) {
    goals.push({ name: "Sample Goal", category: "Math", type: "Quantitative", progress: "0/0", notes: "", lastUpdated: new Date().toLocaleString() });
  } else {
    let goalsdata = localStorage.getItem(id + "goals");
    let goalsarray = goalsdata.split("\n").map(function (line) {
      return line.split(",");
    });
    goalsarray.splice(goalsarray.length - 1, 1);
    goalsarray.forEach((goal) => {
      goals.push({ name: goal[0], category: goal[1], type: goal[2], progress: "0/0", notes: "", lastUpdated: new Date().toLocaleString() });
    });
  }

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
        <td>${goal.lastUpdated}</td>
      `;
      goalsList.appendChild(row);
    });
    let goals2D = [];
    goals.forEach((goal) => {
      goals2D.push([goal.name, goal.category, goal.type]);
    });
    exportToCsv(goals2D);
  }

  function addGoal(event) {
    event.preventDefault();
    const name = document.getElementById("add-name").value;
    const category = document.getElementById("add-category").value;
    const type = document.getElementById("add-type").value;

    const goal = {
      name: name,
      category: category,
      type: type,
      progress: "0/0",
      notes: "",
      lastUpdated: new Date().toLocaleString(),
    };
    goals.push(goal);
    renderGoals();

    document.getElementById("add-goal-form").reset();
  }

  function editGoal(index) {
    const goalsList = document.getElementById("goals-list");
    goalsList.innerHTML = "";

    goals.forEach((goal, goalIndex) => {
      const row = document.createElement("tr");

      if (goalIndex === index) {
        row.innerHTML = `
          <td>
            <button onclick="replaceGoal(${index}, document.getElementById('edit-name').value, document.getElementById('edit-category').value, document.getElementById('edit-type').value)">Confirm</button>
            <button onclick="deleteGoal(${index})">Delete</button>
          </td>
          <td>
            <input type="text" value="${goal.name}" id="edit-name" required>
          </td>
          <td>
            <input type="text" value="${goal.category}" id="edit-category" required>
          </td>
          <td>
            <input type="text" value="${goal.type}" id="edit-type" required>
          </td>
        `;
      } else {
        row.innerHTML = `
          <td>
            <button onclick="editGoal(${goalIndex})">Edit</button>
          </td>
          <td>${goal.name}</td>
          <td>${goal.category}</td>
          <td>${goal.progress}</td>
          <td>${goal.notes}</td>
          <td>${goal.lastUpdated}</td>
        `;
      }

      goalsList.appendChild(row);
    });
  }

  function replaceGoal(index, name, category, type) {
    goals[index] = {
      name: name,
      category: category,
      type: type,
      progress: goals[index].progress,
      notes: goals[index].notes,
      lastUpdated: new Date().toLocaleString(),
    };
    renderGoals();
  }

  function deleteGoal(index) {
    goals.splice(index, 1);
    renderGoals();
  }

  function updateNotes(index, notes) {
    goals[index].notes = notes;
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

  document.getElementById("add-goal-form").addEventListener("submit", addGoal);

  renderGoals();
} else {
  alert("Your session has expired. Please log in again.");
}
