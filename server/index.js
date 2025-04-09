const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 5000;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'postgres',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// app.get('/api/message', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT content FROM messages WHERE id = 1');
//     res.json({ message: result.rows[0].content });
//   } catch (err) {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

const getRandomNumber = (len) => {
  const min = Math.pow(10, len - 1);
  const max = Math.pow(10, len) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/api/random-number/:len', (req, res) => {
  const len = parseInt(req.params.len, 10);
  const number = getRandomNumber(len);
  res.json({ number });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
