const express = require('express');
const {pool} = require('./db_config.js')
const {query} = require('./db_config.js')
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = 5000;
app.use(express.json()); 
const createTable = async()=>{
  try{
  await pool.query(`
     CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        fname VARCHAR(50) UNIQUE NOT NULL,
        lname VARCHAR(100) UNIQUE NOT NULL
        );

      CREATE TABLE IF NOT EXISTS SCORE (
           id SERIAL PRIMARY KEY,
           fname VARCHAR(50) references users(fname),
           lname VARCHAR(100) references users(lname),
           Numbers INT
           );
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
app.post('/api/form/', async (req,res)=>{
  const {fname , lname} = req.body
  res.status(200).json({
    success: true,
    message: 'Data received successfully!',
  })
  try{
  const result = await pool.query(
    'INSERT INTO users (fname , lname) VALUES ($1, $2) RETURNING * '
    , [fname , lname]
  )

}
catch(err){
  console.error(err)
}
})
app.post('/api/data/',(req,res)=>{
  const Number = req.body;
  console.log(req.body)
  res.json({number:Number})

})

app.listen(port,  () => {
  console.log(`Server running on port ${port}`);
  });