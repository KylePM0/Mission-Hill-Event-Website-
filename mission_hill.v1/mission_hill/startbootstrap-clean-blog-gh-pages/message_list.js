const express = require('express');
Test
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const ejs = require('ejs');
const app = express();

app.set(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));




app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

const db = new sqlite3.Database('./messages.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the messages database.');
});

app.post('/messages', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;

    const sql = `INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email, phone, message], function(err) {
        if (err) {
            console.error(err.message);
            res.send('Error submitting message.');
        } else {
            console.log(`A new message with ID ${this.lastID} was added to the database.`);
            res.send('Message submitted successfully.');
        }
        res.redirect('/contact');
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});