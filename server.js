const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const db = new sqlite3.Database('./database.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// Create the fire_equipment table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS fire_equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT NOT NULL,
      status TEXT NOT NULL,
      last_inspection DATE NOT NULL,
      next_inspection DATE NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table created or already exists');
    }
  });
});

// API to add new equipment
app.post('/api/equipment', (req, res) => {
  const { name, type, location, status, last_inspection, next_inspection } = req.body;

  // Validate required fields
  if (!name || !type || !location || !status || !last_inspection || !next_inspection) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO fire_equipment (name, type, location, status, last_inspection, next_inspection)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [name, type, location, status, last_inspection, next_inspection], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// API to fetch all equipment
app.get('/api/equipment', (req, res) => {
  const query = `SELECT * FROM fire_equipment`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Start the server
app.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});