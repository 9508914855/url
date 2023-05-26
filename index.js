const express = require('express');
const shortid = require('shortid');
const sqlite3 = require('sqlite3').verbose();

// Create Express app
const app = express();

// Create SQLite database connection
const db = new sqlite3.Database('urls.db');

// Create table for storing URLs if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS urls (
    id TEXT PRIMARY KEY,
    longUrl TEXT NOT NULL,
    shortCode TEXT NOT NULL,
    isUsed INTEGER DEFAULT 0
  )
`);

// Set up routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the frontend HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle URL shortening request
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;
  const shortCode = shortid.generate();

  // Save the URL to the database
  db.run(
    `INSERT INTO urls (id, longUrl, shortCode) VALUES (?, ?, ?)`,
    [shortid.generate(), longUrl, shortCode],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the URL');
      } else {
        const shortUrl = req.protocol + '://' + req.get('host') + '/' + shortCode;
        res.send(shortUrl);
      }
    }
  );
});

// Handle URL redirection
app.get('/:code', (req, res) => {
  const code = req.params.code;

  // Retrieve the long URL and usage status from the database
  db.get(
    `SELECT longUrl, isUsed FROM urls WHERE shortCode = ?`,
    [code],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving the URL');
      } else if (row) {
        if (row.isUsed) {
          // If the link is already used, redirect to the pre-defined default URL
          res.redirect('https://example.com/default');
        } else {
          // Mark the link as used in the database
          db.run(`UPDATE urls SET isUsed = 1 WHERE shortCode = ?`, [code]);
          res.redirect(row.longUrl);
        }
      } else {
        res.status(404).send('URL not found');
      }
    }
  );
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
