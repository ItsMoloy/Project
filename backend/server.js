const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('frontend'));
app.use(bodyParser.json());
// Database setup
const db = new sqlite3.Database('./db/school.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');
});

// Create tables
db.run(
  `CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    grade TEXT
  )`
);

// Routes
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/students', (req, res) => {
  const { name, grade } = req.body;
  db.run(
    'INSERT INTO students (name, grade) VALUES (?, ?)',
    [name, grade],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, grade });
    }
  );
});

// Start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
