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
  let users = [];

  var dataRef = database.ref('users');
  dataRef.on('value', function(snapshot) {
    users = []; // Clear existing student data
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();

      // Check if data exists in firebase
      // If data exists, retrieve and parse it
      let data = childData;
      let array = Papa.parse(data, { header: false }).data;
      // Remove the last empty element from the array
      array.splice(array.length - 1, 1);
      // Convert each line of data into a student object and add it to the students array
      array.forEach((user) => {
        users.push({
          username: user[0],
          email: user[1],
          password: user[2],
          confirm: user[3],
        });
      }); 
    });
    renderUsers();
  });

  // Function to render the student list
  function renderUsers() {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";
    let id = 0;
    let users2D = [];
    users.forEach((user) => {
      users2D.push([
        user.username,
        user.email,
        user.password,
      ]);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <form id="confirm">
            <button onclick="confirmUser(${id})">Confirm</button>
          </form>
          <form id="deny">
            <button onclick="denyUser(${id})">Deny</button>
          </form>
        </td>
        <td>${user.username}</td>
        <td>${user.email}</td>
      `;
      userList.appendChild(row);
      id++;
    });
    exportToCsv(users2D);
  }

  // Function to deny a user
  function denyUser(id) {
    event.preventDefault();
    if (id >= 0) {
      users.splice(id, 1);
      renderUsers();
    }
  }

  // Function to export data to CSV format and save it to firebase
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
    database.ref("users").child("data").set(csvFile);
  }
} else {
  alert("Your session has expired. Please log in again.");
}
