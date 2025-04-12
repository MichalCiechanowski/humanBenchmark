const express = require('express');
const {pool} = require('./db_config.js')
const {query} = require('./db_config.js')
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = 5000;

const createTable = async()=>{
  try{
  await pool.query(`
     CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        fname VARCHAR(50) UNIQUE NOT NULL,
        lname VARCHAR(100) UNIQUE NOT NULL);
    `); 
    console.log("Table crated or exists")
  }catch(err){
    console.log('Error has occured' ,err)
  }

}
createTable()

app.use(cors())

function getRandomNumber(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/api/random-number/:digits', (req, res) => {
  const count = parseInt(req.params.digits) || 0;
  const randomNumber = getRandomNumber(count);
  res.json({number : randomNumber})
});

app.listen(port,  () => {
  console.log(`Server running on port ${port}`);
  });