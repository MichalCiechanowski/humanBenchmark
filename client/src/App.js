import React, { useState, useEffect } from 'react';
import axios from 'axios'
const API_ROUTE = 'http://localhost:5000'
function App() {
  const [randomNumber , setRandomNumber] = useState();
  const [loginState, setLoginState] = useState(false);
  const [signupState, setSignupState] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [menuState, setMenuState] = useState('menu');
  const [gameState, setGameState] = useState('initial');
  const [countdown, setCountdown] = useState(5);
  const [inputValue, setInputValue] = useState('');
  const [digits , setDigits] = useState(1)
  const [score , setScore] = useState(0)
  const [fname , setFname] = useState('')
  const [lname , setLname] = useState('')
  const goToMenu = () => {
    setMenuState('menu');
    setGameState('initial');
  }

  const goToNumericMemory = () => {
    setMenuState('numeric_memory');
    setCountdown(5);
  }

const startGame = async()=>{
  try{
  setGameState('countdown')
  setCountdown(5)
  const response = await axios.get(`${API_ROUTE}/api/random-number/${digits}`);
  setRandomNumber(response.data.number);
  }
  catch(err)
  {
    alert('Error with fetchning numbers' , err)
    setGameState('initial')

  }
}



  const openLoginWindow = () => {
    setLoginState(true);
    setSignupState(false);
  }

  const openSignUpWindow = () => {
    setSignupState(true);
    setLoginState(false);
  }
  const sendData = async () =>{ 
  console.log(score , fname , lname)
  const apiURL = `${API_ROUTE}/api/data/`
  const res = await axios.post(apiURL ,{data :score , fname , lname} ).then(response => console.log(response))
  .catch(err => console.error(err));
   
  }
 const userlogedin = () =>{
    setIsLogedIn(true)
    setLoginState(false)
    setSignupState(false)
 }

  const numericGameServerCheck = () => {
    if(digits == 1){
      setScore(0)
    }
    setGameState('player_input')
    if (inputValue.toString() === randomNumber?.toString()){
      setGameState('player_win')
      setDigits(digits+1);
      setScore(score+1)

    }else{
      setDigits(1)
      setGameState('player_loose')
      sendData(score)



      
    }
  }
  const handleForm = async (event) =>{
    event.preventDefault()
    const formData = {fname , lname}
    const apiURL = `${API_ROUTE}/api/form/`
    console.log(formData , apiURL)
    try{
      const response = await axios.post(apiURL , formData).then(response=>console.log(response))
      setSignupState(false)

    }
    catch(err){
      console.error(err)
    }

  } 
const handleLogin = async(event) =>{
  event.preventDefault()
  const formData = {fname, lname}
  const apiURL = `${API_ROUTE}/api/login/`
  try{
    const res = await axios.post(apiURL,formData)
    console.log(res.data)
    if(res.data.success){
      alert("User is logged in")
      setLoginState(false)
      setIsLogedIn(true)
      setFname(res.data.user.fname)
      setLname(res.data.user.lname)
    }

  }
  catch(err){
    alert("Invalid user credentials")
  }
}
const handleLogout = () =>{
  setIsLogedIn(false)
  setFname('')
  setLname('')
  alert("User logged out ")
}

  useEffect(() => {
    if (gameState === 'countdown') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('player_input');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  return (
    <main>
      <header>
        {menuState !== 'menu' && (
          <button className='go-back-button' onClick={goToMenu}>Go back</button>
        )}
        {signupState === true &&  (
          <div className='signup'>
            <p>Sign up</p>
            <form className='Signup-form' onSubmit={handleForm}>
              <label for='fname' >First name: </label><br></br>
              <input type='text' if='fname' name='fname' value={fname} onChange={(e) => setFname(e.target.value)}></input><br></br>
              <label for='lname'>Last name: </label><br></br>
              <input type='text' if='lname' name='lname'value={lname} onChange={(e) => setLname(e.target.value)}></input><br></br>
              <button>Submit</button>
            </form>
          </div>
        )}
        {loginState === true && (
          
          <div className="login">
            <p>Login</p>
            <form  className="login-form" onSubmit={handleLogin}>
            <label for='fname' >First name: </label><br></br>
              <input type='text' if='fname' name='fname' value={fname} onChange={(e) => setFname(e.target.value)}></input><br></br>
              <label for='lname'>Last name: </label><br></br>
              <input type='text' if='lname' name='lname'value={lname} onChange={(e) => setLname(e.target.value)}></input><br></br>
              <button>Submit</button>  
            </form>
          </div>
        )}
         <h1>Human Benchmark</h1>
        {isLogedIn === true &&(
          <div className="cred">
            <p id="f">First Name :{fname}</p>
            <p id="l">Last Name :{lname}</p>
            <button id="Logout" onClick={handleLogout}>Logout</button>
          </div>
        )}
       
        <div className='header-buttons'>
          {!isLogedIn&&(
          <>
          <button onClick={openSignUpWindow} className='login-button'>SING UP</button>
          <button onClick={openLoginWindow} className='login-button'>LOGIN</button>
          </>
          )}
        </div>
      </header>

      {menuState == 'menu' && (
        
        <div className='menu'>
          <button onClick={goToNumericMemory}>Numeric Memory</button>
          <button>Reaction Time</button>
          <button>Visual Memory</button>
        </div>
      )}
      {menuState == 'numeric_memory' && (
        <div className='numeric-memory'>
          <h2>Number Memory</h2>
          {gameState === 'initial' &&  (
            <button onClick={startGame}>Start game</button>
          )}
          {gameState === 'countdown' && (
            <div>
              <p>{randomNumber}</p>
              <p>Time left: {countdown}</p>
            </div>
          )}
          {gameState === 'player_input' && (
            <div>
              <form onSubmit={numericGameServerCheck}>
              <input
                type="number"
                placeholder="Enter the number" 
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
              />
              <button type='submit'>Check</button>
              </form>
            </div>
          )}
          {gameState === 'player_win' && (
            <div>
              <p>Number: {randomNumber}</p>
              <p>Your guess: {inputValue}</p>
              <p>Score: {score}</p>
              <button onClick={startGame}>Play next level</button>
            </div>
          )}
          {gameState === 'player_loose' && (
           
            <div>
              <p>Number: {randomNumber}</p>
              <p>Your guess: {inputValue}</p>
              <p>Score: {score}</p>
              <button onClick={startGame}>Play again</button>
            </div> 
            
            
          )}
          <p className='game-description'>
            Test will check how good is your Number memory. During test you will be presented with numbers of increasing length, you have to memorize it during 5 seconds and type the number. How far can you get?
          </p>
        </div>
      )}
    </main>
  );
}

export default App;
