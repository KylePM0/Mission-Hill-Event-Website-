const sqlite3 = require('sqlite3').verbose();

// Open database connection
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the restaurants database.');
});

// Retrieve data
let data = [];
db.each(`SELECT name, city, state, rating FROM restaurants`, (err, row) => {
  if (err) {
    console.error(err.message);
  }
  data.push(row);
});

// Close database connection and display data in HTML
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Disconnected from the restaurants database.');

  // Create HTML table
  let table = '<table><thead><tr><th>Name</th><th>City</th><th>State</th><th>Rating</th></tr></thead><tbody>';
  data.forEach((row) => {
    table += `<tr><td>${row.name}</td><td>${row.city}</td><td>${row.state}</td><td>${row.rating}</td></tr>`;
  });
  table += '</tbody></table>';

  // Display table in HTML file
  document.getElementById('restaurantTable').innerHTML = table;
});