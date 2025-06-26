import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'

const API_ROUTE = 'http://localhost:5000'

function App() {
  // Authentication states (from File 1)
  const [loginState, setLoginState] = useState(false);
  const [signupState, setSignupState] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  
  // Menu and game states
  const [menuState, setMenuState] = useState('menu');
  const [gameStateNumeric, setGameStateNumeric] = useState('initial');
  const [gameStateReaction, setGameStateReaction] = useState('initial');
  const [gameStateVisual, setGameStateVisual] = useState('initial');
  
  // Numeric Memory states
  const [countdownNumeric, setCountdownNumeric] = useState(5);
  const [inputValueNumeric, setInputValueNumeric] = useState('');
  const [currentNumber, setCurrentNumber] = useState('');
  const [numericScore, setNumericScore] = useState(0);
  const [digits, setDigits] = useState(1);
  
  // Reaction Time states
  const [currentRound, setCurrentRound] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [currentReactionTime, setCurrentReactionTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  
  // Visual Memory states
  const [pattern, setPattern] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [patternLength, setPatternLength] = useState(1);
  const [visualScore, setVisualScore] = useState(0);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(-1);
  const [countdownVisual, setCountdownVisual] = useState(3);
  const [showSuccessDelay, setShowSuccessDelay] = useState(false);
  const [isPatternGap, setIsPatternGap] = useState(false);

  // Authentication functions (from File 1)
  const handleForm = async (event) => {
    event.preventDefault();
    const formData = { fname, lname };
    const apiURL = `${API_ROUTE}/api/form/`;
    try {
      const response = await axios.post(apiURL, formData);
      console.log(response);
      setSignupState(false);
      alert("User was added to database");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = { fname, lname };
    const apiURL = `${API_ROUTE}/api/login/`;
    try {
      const res = await axios.post(apiURL, formData);
      console.log(res.data);
      if (res.data.success) {
        alert("User is logged in");
        userLogedIn();
        setFname(res.data.user.fname);
        setLname(res.data.user.lname);
      }
    } catch (err) {
      alert("Invalid user credentials");
    }
  };

  const handleLogout = () => {
    setIsLogedIn(false);
    setFname('');
    setLname('');
    alert("User logged out");
  };

  const userLogedIn = () => {
    setIsLogedIn(true);
    setLoginState(false);
    setSignupState(false);
  };

  const sendData = async (score) => {
    console.log(score, fname, lname);
    const apiURL = `${API_ROUTE}/api/data/`;
    try {
      const res = await axios.post(apiURL, { data: score, fname, lname });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handlepaste = (event) => {
    event.preventDefault();
  };

  // Navigation functions
  const goToMenu = () => {
    setMenuState('menu');
    setGameStateNumeric('initial');
    setGameStateReaction('initial');
    setGameStateVisual('initial');
  };

  const goToNumericMemory = () => {
    if (isLogedIn === true) {
      setMenuState('numeric_memory');
      setGameStateNumeric('initial');
      setNumericScore(0);
      setInputValueNumeric('');
      setCurrentNumber('');
      setDigits(1);
      setCountdownNumeric(5);
    } else {
      alert("User is not logged in");
      goToMenu();
    }
  };

  const goToReactionTime = () => {
    if (isLogedIn === true) {
      resetGameReaction();
      setMenuState('reaction_time');
    } else {
      alert("User is not logged in");
      goToMenu();
    }
  };

  const goToVisualMemory = () => {
    if (isLogedIn === true) {
      setMenuState('visual_memory');
      setGameStateVisual('initial');
      setPatternLength(1);
      setVisualScore(0);
      setPattern([]);
      setPlayerInput([]);
      setCurrentPatternIndex(-1);
      setShowSuccessDelay(false);
      setIsPatternGap(false);
    } else {
      alert("User is not logged in");
      goToMenu();
    }
  };

  const openLoginWindow = () => {
    setLoginState(true);
    setSignupState(false);
  };

  const openSignUpWindow = () => {
    setSignupState(true);
    setLoginState(false);
  };

  // Numeric Memory functions
  const startGameNumeric = async () => {
    try {
      setGameStateNumeric('countdown');
      setCountdownNumeric(5);
      const response = await axios.get(`${API_ROUTE}/api/random-number/${digits}`);
      setCurrentNumber(response.data.number.toString());
    } catch (err) {
      alert('Error with fetching numbers');
      setGameStateNumeric('initial');
    }
  };

  const numericGameServerCheck = () => {
    if (digits === 1) {
      setNumericScore(0);
    }
    setGameStateNumeric('player_input');
    
    if (inputValueNumeric.toString() === currentNumber?.toString()) {
      setGameStateNumeric('player_win');
      setDigits(digits + 1);
      setNumericScore(numericScore + 1);
    } else {
      setDigits(1);
      setGameStateNumeric('player_loose');
      sendData(numericScore);
    }
  };

  const nextRoundNumeric = () => {
    setInputValueNumeric('');
    startGameNumeric();
  };

  // Reaction Time functions
  const startGameReaction = () => {
    setGameStateReaction('waiting');
    setCurrentRound(1);
    setReactionTimes([]);
    setBestScore(null);
    setAverageScore(null);
    triggerRandomDelay();
  };

  const resetGameReaction = () => {
    setGameStateReaction('initial');
    setCurrentRound(1);
    setReactionTimes([]);
    setBestScore(null);
    setAverageScore(null);
    setCurrentReactionTime(null);
  };

  const triggerRandomDelay = () => {
    const delay = Math.random() * 3000 + 1000;
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

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
    setGameStateReaction('waiting');
    setCurrentReactionTime(null);
    triggerRandomDelay();
  };
  
  // Visual Memory functions
  const addToPattern = () => {
    const newPattern = [...pattern];
    const newSquare = Math.floor(Math.random() * 9);
    newPattern.push(newSquare);
    return newPattern;
  };

  const startGameVisual = () => {
    setPlayerInput([]);
    setCurrentPatternIndex(-1);
    setShowSuccessDelay(false);
    setIsPatternGap(false);
    
    if (pattern.length === 0) {
      setPattern(addToPattern());
    }
    
    if (visualScore > 0) {
      setGameStateVisual('show_pattern');
      setCurrentPatternIndex(0);
    } else {
      setGameStateVisual('countdown');
      setCountdownVisual(3);
    }
  };

  const handleSquareClick = (index) => {
    if (gameStateVisual === 'player_input') {
      const currentInput = [...playerInput, index];
      setPlayerInput(currentInput);
      const currentInputIndex = currentInput.length - 1;
      
      if (pattern[currentInputIndex] !== index) {
        setGameStateVisual('player_loose');
        sendData(visualScore);
      } else if (currentInput.length === pattern.length) {
        setShowSuccessDelay(true);
      }
    }
  };

  // useEffect hooks
  useEffect(() => {
    if (gameStateNumeric === 'countdown') {
      const timer = setInterval(() => {
        setCountdownNumeric((prev) => {
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

  useEffect(() => {
    if (gameStateVisual === 'countdown') {
      const timer = setInterval(() => {
        setCountdownVisual((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStateVisual('show_pattern');
            setCurrentPatternIndex(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStateVisual]);

  useEffect(() => {
    if (gameStateVisual === 'show_pattern' && currentPatternIndex >= 0) {
      if (currentPatternIndex < pattern.length) {
        let delay = 1000;
        if (
          currentPatternIndex < pattern.length - 1 &&
          pattern[currentPatternIndex] === pattern[currentPatternIndex + 1]
        ) {
          setIsPatternGap(true);
          delay = 200;
        } else {
          setIsPatternGap(false);
        }
        const timer = setTimeout(() => {
          setCurrentPatternIndex(currentPatternIndex + 1);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setGameStateVisual('player_input');
        setCurrentPatternIndex(-1);
        setIsPatternGap(false);
      }
    }
  }, [gameStateVisual, currentPatternIndex, pattern]);

  useEffect(() => {
    if (showSuccessDelay) {
      const timer = setTimeout(() => {
        setVisualScore(visualScore + 1);
        setPatternLength(patternLength + 1);
        setPattern(addToPattern());
        setGameStateVisual('player_win');
        setShowSuccessDelay(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessDelay, pattern, visualScore, patternLength]);

  useEffect(() => {
    if (currentRound === 5 && reactionTimes.length === 5) {
      const avg = Math.round(
        reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length
      );
      setAverageScore(avg);
      sendData(bestScore); // Send best reaction time as score
    }
  }, [reactionTimes]);

  return (
    <main>
      <header>
        {menuState !== 'menu' && (
          <button className='go-back-button' onClick={goToMenu}>Go back</button>
        )}
        
        {signupState === true && (
          <div className='signup'>
            <p>Sign up</p>
            <form className='Signup-form' onSubmit={handleForm}>
              <label htmlFor='fname'>First name: </label><br />
              <input 
                type='text' 
                id='fname' 
                name='fname' 
                value={fname} 
                onChange={(e) => setFname(e.target.value)}
              /><br />
              <label htmlFor='lname'>Last name: </label><br />
              <input 
                type='text' 
                id='lname' 
                name='lname' 
                value={lname} 
                onChange={(e) => setLname(e.target.value)}
              /><br />
              <button>Submit</button>
            </form>
          </div>
        )}
        
        {loginState === true && (
          <div className="login">
            <p>Login</p>
            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor='fname'>First name: </label><br />
              <input 
                type='text' 
                id='fname' 
                name='fname' 
                value={fname} 
                onChange={(e) => setFname(e.target.value)}
              /><br />
              <label htmlFor='lname'>Last name: </label><br />
              <input 
                type='text' 
                id='lname' 
                name='lname' 
                value={lname} 
                onChange={(e) => setLname(e.target.value)}
              /><br />
              <button>Submit</button>
            </form>
          </div>
        )}
        
        <h1>Human Benchmark</h1>
        
        {isLogedIn === true && (
          <div className="cred">
            <p id="f">First Name: {fname}</p>
            <p id="l">Last Name: {lname}</p>
            <button id="Logout" onClick={handleLogout}>Logout</button>
          </div>
        )}
        
        <div className='header-buttons'>
          {!isLogedIn && (
            <>
              <button onClick={openSignUpWindow} className='login-button'>SIGN UP</button>
              <button onClick={openLoginWindow} className='login-button'>LOGIN</button>
            </>
          )}
        </div>
      </header>

      {menuState === 'menu' && (
        <div className='menu'>
          <button onClick={goToNumericMemory}>Numeric Memory</button>
          <button onClick={goToReactionTime}>Reaction Time</button>
          <button onClick={goToVisualMemory}>Visual Memory</button>
        </div>
      )}

      {menuState === 'numeric_memory' && (
        <div className='numeric-memory'>
          <h2>Number Memory</h2>
          {gameStateNumeric === 'initial' && (
            <button onClick={startGameNumeric}>Start game</button>
          )}
          {gameStateNumeric === 'countdown' && (
            <div>
              <p>{currentNumber}</p>
              <p>Time left: {countdownNumeric}</p>
            </div>
          )}
          {gameStateNumeric === 'player_input' && (
            <div>
              <form onSubmit={numericGameServerCheck}>
                <input
                  type="number"
                  placeholder="Enter the number"
                  value={inputValueNumeric}
                  onChange={(e) => setInputValueNumeric(e.target.value)}
                  onPaste={handlepaste}
                />
                <button type='submit'>Check</button>
              </form>
            </div>
          )}
          {gameStateNumeric === 'player_win' && (
            <div>
              <p>Number: {currentNumber}</p>
              <p>Your guess: {inputValueNumeric}</p>
              <p>Score: {numericScore}</p>
              <button onClick={nextRoundNumeric}>Play next level</button>
            </div>
          )}
          {gameStateNumeric === 'player_loose' && (
            <div>
              <p>Number: {currentNumber}</p>
              <p>Your guess: {inputValueNumeric}</p>
              <p>Score: {numericScore}</p>
              <button onClick={startGameNumeric}>Play again</button>
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
                  <button onClick={resetGameReaction}>Play again</button>
                </div>
              )}
            </div>
          )}
          <p className='game-description'>
            Test will check how good is your Reaction time. Test will show you red button when it will change to green click on it as fast as you can you will be shown your reaction time. Test will repeat itself 5 times and save best score and average of scores from 5 tests. How fast are you?
          </p>
          {gameStateReaction !== 'initial' && gameStateReaction !== 'result' && (
            <p>Round: {currentRound} / 5</p>
          )}
        </div>
      )}

      {menuState === 'visual_memory' && (
        <div className='visual-memory'>
          <h2>Visual Memory</h2>
          {gameStateVisual === 'initial' && (
            <button onClick={startGameVisual}>Start game</button>
          )}
          {gameStateVisual === 'countdown' && (
            <div>
              <p>Get ready!</p>
              <p>Time left: {countdownVisual}</p>
            </div>
          )}
          {(gameStateVisual === 'show_pattern' || gameStateVisual === 'player_input' || showSuccessDelay) && (
            <div>
              {gameStateVisual === 'show_pattern' && (
                <p>Memorize the pattern...</p>
              )}
              {gameStateVisual === 'player_input' && !showSuccessDelay && (
                <p>Now repeat the pattern!</p>
              )}
              {showSuccessDelay && (
                <p>Correct! Preparing next level...</p>
              )}
              <div className='grid'>
                {Array(9).fill().map((_, index) => (
                  <div
                    key={index}
                    className={`square ${
                      gameStateVisual === 'show_pattern' && !isPatternGap && currentPatternIndex >= 0 && pattern[currentPatternIndex] === index 
                        ? 'pattern-active' 
                        : (gameStateVisual === 'player_input' || showSuccessDelay) && playerInput.includes(index) 
                        ? 'selected' 
                        : ''
                    }`}
                    onClick={() => handleSquareClick(index)}
                  />
                ))}
              </div>
            </div>
          )}
          {gameStateVisual === 'player_win' && (
            <div>
              <p>Correct!</p>
              <p>Score: {visualScore}</p>
              <button onClick={startGameVisual}>Next level</button>
            </div>
          )}
          {gameStateVisual === 'player_loose' && (
            <div>
              <p>Incorrect!</p>
              <p>Final Score: {visualScore}</p>
              <button onClick={goToVisualMemory}>Play again</button>
            </div>
          )}
          <p className='game-description'>
            Test your visual memory! Memorize the pattern of highlighted squares in the 3x3 grid as they light up one by one. Repeat the pattern by clicking the squares in the exact order they appeared. Each correct sequence adds one new square to the pattern, which may repeat squares. One wrong click ends the game. How many can you remember?
          </p>
        </div>
      )}
    </main>
  );
}

export default App;