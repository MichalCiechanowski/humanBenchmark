 const {Pool} = require('pg')
require('dotenv').config()

const pool = new Pool({
    user:process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

const query = async(text,params) =>{
    const start = Date.now()
    const res = await pool.query(text , params)
    const duration = Date.now() - start
    console.log('Executed query' , {text , duration})
    return res

}

  module.exports = {pool , query}