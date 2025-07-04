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

      CREATE TABLE IF NOT EXISTS SCORE_NUM (
           id SERIAL PRIMARY KEY,
           id_user INT references  users(id),
           Numbers INT
           );
      CREATE TABLE IF NOT EXISTS SCORE_REACTION (
           id SERIAL PRIMARY KEY,
           id_user INT references  users(id),
           Best INT,
           Average INT
           );
       CREATE TABLE IF NOT EXISTS SCORE_VIS (
           id SERIAL PRIMARY KEY,
           id_user INT references  users(id),
           Score INT
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
app.post('/api/data/', async (req,res)=>{
  try{
  const {data , fname , lname} = req.body

  const cred = await pool.query('Select id FROM users WHERE fname = $1 and lname = $2',[fname,lname]
  )
  if (cred.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
   }
  const id = cred.rows[0].id
  const que = await pool.query('Insert into score_num(id_user,numbers) values ($1,$2)', [id, data])
   res.status(200).json({ success: true, message: "Score inserted successfully" });
  } catch (err) {
    console.error("Error inserting score:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }

})
app.post('/api/login/', async (req,res)=>{
  const {fname,lname } = req.body

  try{
   const que = await pool.query('SELECT id, fname, lname FROM USERS WHERE fname = $1 and lname = $2',[fname,lname])
    if(que.rows.length  === 0){
      return res.status(404).json({
        success:false,
        message:"Couldnt find user with these credentials"
      })

    }
    else{
    res.status(200).json({
      success:true,
      user:que.rows[0]
    })
  }
  }
  catch(err){
    console.error(err)
  }
})
app.post('/api/reaction-score/', async (req, res) => {
  try {
    const { best, average, fname, lname } = req.body;

    // Find user by name and get their ID
    const cred = await pool.query('SELECT id FROM users WHERE fname = $1 AND lname = $2', [fname, lname]);
    
    if (cred.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userId = cred.rows[0].id;
    
    // Insert reaction scores into score_reaction table
    const que = await pool.query(
      'INSERT INTO score_reaction(id_user, best, average) VALUES ($1, $2, $3)', 
      [userId, best, average]
    );
    
    res.status(200).json({ success: true, message: "Reaction scores inserted successfully" });
  } catch (err) {
    console.error("Error inserting reaction scores:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post('/api/visual-score/', async (req, res) => {
  try {
    const { score, fname, lname } = req.body;

    // Find user by name and get their ID
    const cred = await pool.query('SELECT id FROM users WHERE fname = $1 AND lname = $2', [fname, lname]);
    
    if (cred.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userId = cred.rows[0].id;
    
    // Insert visual score into score_vis table
    const que = await pool.query(
      'INSERT INTO score_vis(id_user, score) VALUES ($1, $2)', 
      [userId, score]
    );
    
    res.status(200).json({ success: true, message: "Visual score inserted successfully" });
  } catch (err) {
    console.error("Error inserting visual score:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.listen(port,  () => {
  console.log(`Server running on port ${port}`);
  });