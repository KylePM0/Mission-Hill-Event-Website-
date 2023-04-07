const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');


const app = express();
const PORT = 3001;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//This command searches for a database in the root directory named events.db and if it exists, it will connect to it. Other, it will create it for us.
const event_db = new sqlite3.Database('./events.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connection to 'events.db' established...'");
})

//Creates an Event Table where we'll store data about our Events.
const sql_create_event_db = `CREATE TABLE IF NOT EXISTS events (
    event_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Address TEXT NOT NULL,
    Time TEXT NOT NULL
);`;

//Database Seeding for the Events Database
const events_insert = `INSERT INTO events (event_ID, Name, Address, Time) VALUES
(1, 'Coffee Chats with CAs', '1478 Tremont St, Boston, MA 02120', 'Sat, Mar 25, 4 – 6PM'),
(2, 'The Barbershop Clinic', '1473 Tremont St, Boston, MA 02120', 'Sun, Mar 26, 3 – 6 PM'),
(3, 'Our Story!', '543 Columbia Rd, Boston, MA 02120', 'Sat, Mar 25, 11 AM – 1 PM'),
(4, 'Picture Book Hour', '279 Harvard St, Brookline, MA 02446', 'Sun, Mar 26, 10:30 – 11:00 AM');`;

//This creates a table of events for us. we've established a connection to a database, now we're going to create a table within it.
event_db.run(sql_create_event_db, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Creation of the 'events' table established...");
});

// Inserts the above list into the Events Database.
event_db.run(events_insert, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Inserted 4 events into the events database...");
});

//RESTAURANT DATABASE SET UP START-------------------------------------------------------------------------------
//This command searches for a database in the root directory named events.db and if it exists, it will connect to it. Other, it will create it for us.
const rest_db = new sqlite3.Database('./restaurants.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connection to 'restaurants.db' established...'");
});

//Creates an restaurant table where we'll store data about our restaurants.
const sql_create_rest_db = `CREATE TABLE IF NOT EXISTS restaurants (
    rest_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Address TEXT NOT NULL,
    Phone TEXT NOT NULL
);`;

//This creates a table of restaurants for us. we've established a connection to a database, now we're going to create a table within it.
rest_db.run(sql_create_rest_db, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Creation of the 'restaurant' table established...");
});

const rest_insert = `INSERT INTO restaurants (rest_ID, Name, Address, Phone) VALUES
(1, 'Chilacates', '1482 A Tremont St, Boston, MA 02120', '(617) 238-5437'),
(2, 'Milkweed', '1508 Tremont St, Boston, MA 02120', '(617) 516-8913'),
(3, 'The Squealing Pig', '134 Smith St, Boston, MA 02120', '(617) 322-5299'),
(4, 'Ginger Exchange', '1625 Tremont St, Boston, MA 02120', '(617) 739-8888')
;`;

// Inserts the above list into the Restaurant Database.
rest_db.run(rest_insert, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Inserted 4 events into the restaurants database...");
});



// Below are the serve responses for when a user clicks on our navigation page looking for a specific page.

//This gets the "root" file, which is our index and it is the first thing served when we vist our website. It also returns the user back here when they click on the homepage.
app.get("/", (req, res) => {
    res.render("index")
})

//This serves the about us page.
app.get("/about.ejs", (req, res) => {
    res.render("about")
})

//This serves the contact us page.
app.get("/contact.ejs", (req, res) => {
    res.render("contact")
})

//This serves the restaurant page.
app.get("/rest.ejs", (req, res) => {
    const sql = "SELECT * FROM restaurants ORDER BY rest_ID"
    rest_db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.render("rest", { restaurants: rows });
    });
})

//Creates a table of events using our events database.
app.get('/post.ejs', (req, res) => {
    const sql = "SELECT * FROM events ORDER BY event_ID"
    event_db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.render("post", { events: rows });
    });
})

app.post('/create_event', (req, res) => {
    const event_name = req.body.event_name;
    const event_address = req.body.event_address;
    const event_time = req.body.event_time;

    event_db.run(`INSERT INTO events (Name, Address, Time) VALUES (?, ?, ?)`, [event_name, event_address, event_time], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.redirect("/post.ejs");
    });
});

app.post('/create_rest', (req, res) => {
    const rest_name = req.body.rest_name;
    const rest_address = req.body.rest_address;
    const rest_num = req.body.rest_num;

    rest_db.run(`INSERT INTO restaurants (Name, Address, Phone) VALUES (?, ?, ?)`, [rest_name, rest_address, rest_num], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.redirect("/rest.ejs");
    });
});

app.post('/sendemail', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'webdevsnailmailbot@gmail.com',
            pass: 'tsvksrpxrjzxbagc'
        }
    });

    let messageBody = `From: ${req.body.contact_name}\n`;
    messageBody += `Phone number: ${req.body.contact_num}\n\n`;
    messageBody += `Message: ${req.body.contact_message}\n\n`;


    const mailOptions = {
        from: req.body.contact_email,
        to: 'kylepm06@gmail.com',
        subject: req.body.contact_subject,
        text: messageBody
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.render("failure.ejs");
        } else {
            console.log('Email sent: ' + info.response);
            res.render("success.ejs");
        }
    });
});

//function that lets us listen on a port. This is where we will host our website.
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});