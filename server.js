const sqlite3 = require("sqlite3").verbose();
const express = require("express")

const app = express();
const PORT = 3001;

app.set("view engine", "ejs");
app.use(express.static("public"));

//This command searches for a database in the root directory named events.db and if it exists, it will connect to it. Other, it will create it for us.
const db = new sqlite3.Database('./events.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connection to 'events.db' established...'");
})

const sql_create_event_db = `CREATE TABLE IF NOT EXISTS events (
    event_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Address TEXT NOT NULL,
    Time TEXT NOT NULL

);`;

//This creates a table of events for us. we've established a connection to a database, now we're going to create a table within it.
db.run(sql_create_event_db, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Creation of the 'events' table...");
});

//Database Seeding
const events_insert = `INSERT INTO events (event_ID, Name, Address, Time) VALUES
(1, 'Coffee Chats with CAs', '1478 Tremont St, Boston, MA 02120', 'Sat, Mar 25, 4 – 6PM'),
(2, 'The Barbershop Clinic', '1473 Tremont St, Boston, MA 02120', 'Sun, Mar 26, 3 – 6 PM'),
(3, 'Our Story!', '543 Columbia Rd, Boston, MA 02120', 'Sat, Mar 25, 11 AM – 1 PM'),
(4, 'Picture Book Hour', '279 Harvard St, Brookline, MA 02446', 'Sun, Mar 26, 10:30 – 11:00 AM');`;

db.run(events_insert, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Inserted 3 events into the events database...");
})

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
    res.render("rest")
})


//Creates a table of events using our events database.
app.get('/post.ejs', (req, res) => {
    const sql = "SELECT * FROM events ORDER BY event_ID"
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.render("post", { events: rows });
    });
})

//function that lets us listen on a port. This is where we will host our website.
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});