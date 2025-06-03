import React, { useState, useEffect } from 'react';

function App() {
  const [loginState, setLoginState] = useState(false);
  const [signupState, setSignupState] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [menuState, setMenuState] = useState('menu');
  const [gameStateNumeric, setGameStateNumeric] = useState('initial');
  const [gameStateReaction, setGameStateReaction] = useState('initial');
  const [currentRound, setCurrentRound] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [currentReactionTime, setCurrentReactionTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [countdownNumeric, setCountdown] = useState(5);
  const [inputValueNumeric, setInputValue] = useState('');

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
    setGameStateReaction('waiting');
    setCurrentReactionTime(null);
    triggerRandomDelay();
  };

  const resetGame = () => {
    setGameStateReaction('initial');
    setCurrentRound(1);
    setReactionTimes([]);
    setBestScore(null);
    setAverageScore(null);
    setCurrentReactionTime(null);
  };

  // Calculate average score when all rounds are complete
  useEffect(() => {
    if (currentRound === 5 && reactionTimes.length === 5) {
      const avg = Math.round(
        reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length
      );
      setAverageScore(avg);
    }
  }, [reactionTimes]);
  const startGameReaction = () => {
    setGameStateReaction('waiting');
    setCurrentRound(1);
    setReactionTimes([]);
    setBestScore(null);
    setAverageScore(null);
    triggerRandomDelay();
  };

  const triggerRandomDelay = () => {
    const delay = Math.random() * 3000 + 1000; // Random delay between 1-4 seconds
    setTimeout(() => {
      setStartTime(Date.now());
      setGameStateReaction('click');
    }, delay);
  };

  const handleClick = (clickTime) => {
    const reactionTime = clickTime - startTime;
    setCurrentReactionTime(reactionTime);
    setReactionTimes([...reactionTimes, reactionTime]);
    setBestScore((prev) => (prev === null || reactionTime < prev ? reactionTime : prev));
    setGameStateReaction('result');
  };

  const goToMenu = () => {
    setMenuState('menu');
    setGameStateNumeric('initial');
  }

  const goToNumericMemory = () => {
    setMenuState('numeric_memory');
    setCountdown(5);
  }

  const goToReactionTime = () => {
    resetGame();
    setMenuState('reaction_time');
  }

  const startGameNumeric = () => {
    setGameStateNumeric('countdown');
    setCountdown(5);
  }

  const handleInput = (event) => {
    setInputValue(event.target.value);
    console.log(inputValueNumeric)
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
    if (gameStateNumeric === 'countdown') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStateNumeric('player_input');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStateNumeric]);

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
          <button onClick={goToReactionTime}>Reaction Time</button>
          <button>Visual Memory</button>
        </div>
      )}
      {menuState == 'numeric_memory' && (
        <div className='numeric-memory'>
          <h2>Number Memory</h2>
          {gameStateNumeric === 'initial' && (
            <button onClick={startGameNumeric}>Start game</button>
          )}
          {gameStateNumeric === 'countdown' && (
            <div>
              <p>placeholder</p>
              <p>Time left{countdownNumeric}</p>
            </div>
          )}
          {gameStateNumeric === 'player_input' && (
            <div>
              <input
                type="number"
                placeholder="Enter the number"
              />
              <button onClick={numericGameServerCheck}>Confirm</button>
            </div>
          )}
          {gameStateNumeric === 'player_win' && (
            <div>
              <p>Number: placeholder</p>
              <p>Your guess: placeholder</p>
              <p>Score: </p>
              <button onClick={startGameNumeric}>Play next level</button>
            </div>
          )}
          {gameStateNumeric === 'player_loose' && (
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
      {menuState === 'reaction_time' && (
        <div className='reaction-time'>
          <h2>Reaction Time</h2>

          {gameStateReaction === 'initial' && (
            <button onClick={startGameReaction}>Start game</button>
          )}

          {gameStateReaction === 'waiting' && (
            <button className='not-button' disabled>Not yet</button>
          )}

          {gameStateReaction === 'click' && (
            <button
              className='go-button'
              onClick={() => handleClick(Date.now())}
            >
              Click now!
            </button>
          )}

          {gameStateReaction === 'result' && (
            <div>
              <p>Your reaction time: {currentReactionTime} ms</p>
              {currentRound < 5 ? (
                <button onClick={nextRound}>Next round</button>
              ) : (
                <div>
                  <p>Best score: {bestScore} ms</p>
                  <p>Average score: {averageScore} ms</p>
                  <button onClick={resetGame}>Play again</button>
                </div>
              )}
            </div>
          )}

          <p className='game-description'>
            Test will check how good is your Reaction time. Test will show you red button when it will change to green click on it as fast as you can you will be shown your reaction time. Test will repite itself 5 times and save best score and average of scores from 5 tests. How fast are you?
          </p>

          {gameStateReaction !== 'initial' && gameStateReaction !== 'result' && (
            <p>Round: {currentRound} / 5</p>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
