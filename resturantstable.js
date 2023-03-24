const sqlite3 = require('sqlite3').verbose();

// Open database connection
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the restaurants database.');
});

// Create table
db.run(`CREATE TABLE restaurants (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  rating INTEGER
)`);

// Insert data
db.run(`INSERT INTO restaurants(name, city, state, rating) VALUES (?, ?, ?, ?)`, 
  ['Restaurant A', 'Chicago', 'IL', 4]);
db.run(`INSERT INTO restaurants(name, city, state, rating) VALUES (?, ?, ?, ?)`, 
  ['Restaurant B', 'Los Angeles', 'CA', 3]);
db.run(`INSERT INTO restaurants(name, city, state, rating) VALUES (?, ?, ?, ?)`, 
  ['Restaurant C', 'New York', 'NY', 5]);

// Close database connection
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Disconnected from the restaurants database.');
});


