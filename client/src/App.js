import React, { useState, useEffect } from 'react';

function App() {
  const [menuState, setMenuState] = useState('menu');
  const [gameState, setGameState] = useState('initial');
  const [countdown, setCountdown] = useState(5);

  const goToMenu = () => {
    setMenuState('menu');
  }

  const goToNumericMemory = () => {
    setMenuState('numeric_memory');
  }

  const startGame = () => {
    setGameState('countdown');
    setCountdown(5);
  }

  useEffect(() => {
    if (gameState === 'countdown') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('playerInput');
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
        {menuState != 'menu' && (
          <button className='go-back-button' onClick={goToMenu}>Go back</button>
        )}
        <h1>Human Benchamrk</h1>
        <div className='header-buttons'>
          <button className='login-button'>SING UP</button>
          <button className='login-button'>LOGIN</button>
        </div>
      </header>
      {menuState == 'menu' && (
        <div className='menu'>
          <button onClick={goToNumericMemory}>Numeric Memory</button>
          <button >Reaction Time</button>
          <button >Visual Memory</button>
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
          {gameState === 'playerInput' && (
            <div>
              <input placeholder="Enter the number"></input>
              <button>Confirm</button>
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
