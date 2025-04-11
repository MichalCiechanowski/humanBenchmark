import React, { useState, useEffect } from 'react';

function App() {
  const [loginState, setLoginState] = useState(false);
  const [signupState, setSignupState] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [menuState, setMenuState] = useState('menu');
  const [gameState, setGameState] = useState('initial');
  const [countdown, setCountdown] = useState(5);
  const [inputValue, setInputValue] = useState('');

  const goToMenu = () => {
    setMenuState('menu');
    setGameState('initial');
  }

  const goToNumericMemory = () => {
    setMenuState('numeric_memory');
    setCountdown(5);
  }

  const startGame = () => {
    setGameState('countdown');
    setCountdown(5);
  }

  const handleInput = (event) => {
    setInputValue(event.target.value);
    console.log(inputValue)
  }

  const openLoginWindow = () => {
    setLoginState(true);
  }

  const openSignUpWindow = () => {
    setSignupState(true);
  }

  const numericGameServerCheck = () => {

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
        {loginState === true && (
          <div className='login'>
            <p>Login</p>
            <form className='login-form'>
              <label for='fname'>First name: </label><br></br>
              <input type='text' if='fname' name='fname'></input><br></br>
              <label for='lname'>Last name: </label><br></br>
              <input type='text' if='lname' name='lname'></input><br></br>
              <button>Submit</button>
            </form>
          </div>
        )}
        <h1>Human Benchamrk</h1>
        <div className='header-buttons'>
          <button onClick={openLoginWindow} className='login-button'>SING UP</button>
          <button onClick={openSignUpWindow} className='login-button'>LOGIN</button>
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
          {gameState === 'initial' && (
            <button onClick={startGame}>Start game</button>
          )}
          {gameState === 'countdown' && (
            <div>
              <p>placeholder</p>
              <p>Time left{countdown}</p>
            </div>
          )}
          {gameState === 'player_input' && (
            <div>
              <input
                type="number"
                placeholder="Enter the number"
              />
              <button onClick={numericGameServerCheck}>Confirm</button>
            </div>
          )}
          {gameState === 'player_win' && (
            <div>
              <p>Number: placeholder</p>
              <p>Your guess: placeholder</p>
              <p>Score: </p>
              <button onClick={startGame}>Play next level</button>
            </div>
          )}
          {gameState === 'player_loose' && (
            <div>
              <p>Number: placeholder</p>
              <p>Your guess: placeholder</p>
              <p>Score: </p>
              <button onClick={goToNumericMemory}>Play again</button>
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
