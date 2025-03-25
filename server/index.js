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

app.get('/api/message', async (req, res) => {
  try {
    const result = await pool.query('SELECT content FROM messages WHERE id = 1');
    res.json({ message: result.rows[0].content });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
