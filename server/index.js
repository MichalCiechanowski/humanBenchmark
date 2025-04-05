const express = require('express');
const { Pool } = require('pg');
const cors = require('cors')
require('dotenv').config();

const app = express();
const port = 5000;
app.use(cors())
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//function that randomise numbers
function randomNumbers( count){
  min = Math.pow(10 , count)
  max = Math.pow(10 ,  count +1) -1
  return number = Math.floor(Math.random() * (max - min + 1) + min) 

}

app.get('/api/random_number/:count' , (req , res)=>{
  const count = parseInt(req.params.count) || 0;
  const randomNumber = randomNumbers(count);
  res.json({number : randomNumber})

})

