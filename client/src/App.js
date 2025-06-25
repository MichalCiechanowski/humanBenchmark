import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [loginState, setLoginState] = useState(false);
  const [signupState, setSignupState] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [menuState, setMenuState] = useState('menu');
  const [gameStateNumeric, setGameStateNumeric] = useState('initial');
  const [gameStateReaction, setGameStateReaction] = useState('initial');
  const [gameStateVisual, setGameStateVisual] = useState('initial');
  const [currentRound, setCurrentRound] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [currentReactionTime, setCurrentReactionTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [countdownNumeric, setCountdown] = useState(5);
  const [inputValueNumeric, setInputValue] = useState('');
  const [currentNumber, setCurrentNumber] = useState(''); // New state for correct number
  const [numericScore, setNumericScore] = useState(0); // New state for score
  // Visual Memory states
  const [pattern, setPattern] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [patternLength, setPatternLength] = useState(1);
  const [visualScore, setVisualScore] = useState(0);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(-1);
  const [countdownVisual, setCountdownVisual] = useState(3);
  const [showSuccessDelay, setShowSuccessDelay] = useState(false);
  const [isPatternGap, setIsPatternGap] = useState(false);

  // Generate a random number with length based on round
  const generateNumber = (length) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const nextRoundNumeric = () => {
    setNumericScore(numericScore + 1);
    setInputValue('');
    setGameStateNumeric('countdown');
    setCountdown(5);
    setCurrentNumber(generateNumber(numericScore + 2).toString()); // Increase length each round
  };

  const startGameNumeric = () => {
    setGameStateNumeric('countdown');
    setCountdown(5);
    setNumericScore(0);
    setInputValue('');
    setCurrentNumber(generateNumber(1).toString()); // Start with 1-digit number
  };

  const numericGameServerCheck = () => {
    if (inputValueNumeric === currentNumber) {
      setGameStateNumeric('player_win');
    } else {
      setGameStateNumeric('player_loose');
    }
  };

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

  const goToMenu = () => {
    setMenuState('menu');
    setGameStateNumeric('initial');
    setGameStateVisual('initial');
  };

  const goToNumericMemory = () => {
    setMenuState('numeric_memory');
    setGameStateNumeric('initial');
    setNumericScore(0);
    setInputValue('');
    setCurrentNumber('');
  };

  const goToReactionTime = () => {
    resetGame();
    setMenuState('reaction_time');
  };

  const goToVisualMemory = () => {
    setMenuState('visual_memory');
    setGameStateVisual('initial');
    setPatternLength(1);
    setVisualScore(0);
    setPattern([]);
    setPlayerInput([]);
    setCurrentPatternIndex(-1);
    setShowSuccessDelay(false);
    setIsPatternGap(false);
  };

  const handleInput = (event) => {
    setInputValue(event.target.value);
  };

  const openLoginWindow = () => {
    setLoginState(true);
  };

  const openSignUpWindow = () => {
    setSignupState(true);
  };

  // Visual Memory game logic
  const addToPattern = () => {
    const newPattern = [...pattern];
    const newSquare = Math.floor(Math.random() * 9); // Allow repeated squares
    newPattern.push(newSquare);
    return newPattern;
  };

  const startGameVisual = () => {
    setPlayerInput([]);
    setCurrentPatternIndex(-1);
    setShowSuccessDelay(false);
    setIsPatternGap(false);
    // Initialize or expand pattern
    if (pattern.length === 0) {
      setPattern(addToPattern());
    }
    // Skip countdown if not the first round
    if (visualScore > 0) {
      setGameStateVisual('show_pattern');
      setCurrentPatternIndex(0); // Start with first square
    } else {
      setGameStateVisual('countdown');
      setCountdownVisual(3);
    }
  };

  const handleSquareClick = (index) => {
    if (gameStateVisual === 'player_input') {
      const currentInput = [...playerInput, index];
      setPlayerInput(currentInput);
      // Check if the clicked square is correct in the exact order
      const currentInputIndex = currentInput.length - 1;
      if (pattern[currentInputIndex] !== index) {
        setGameStateVisual('player_loose');
      } else if (currentInput.length === pattern.length) {
        setShowSuccessDelay(true); // Trigger delay to show green squares
      }
    }
  };

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

  useEffect(() => {
    if (gameStateVisual === 'countdown') {
      const timer = setInterval(() => {
        setCountdownVisual((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStateVisual('show_pattern');
            setCurrentPatternIndex(0); // Start with first square
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
        let delay = 1000; // Default 1-second glow
        // If next square is the same, insert a 200ms gap
        if (
          currentPatternIndex < pattern.length - 1 &&
          pattern[currentPatternIndex] === pattern[currentPatternIndex + 1]
        ) {
          setIsPatternGap(true);
          delay = 200; // Shorten delay for gap
        } else {
          setIsPatternGap(false);
        }
        const timer = setTimeout(() => {
          setCurrentPatternIndex(currentPatternIndex + 1);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setGameStateVisual('player_input');
        setCurrentPatternIndex(-1); // Reset for next round
        setIsPatternGap(false);
      }
    }
  }, [gameStateVisual, currentPatternIndex, pattern]);

  useEffect(() => {
    if (showSuccessDelay) {
      const timer = setTimeout(() => {
        setVisualScore(visualScore + 1);
        setPatternLength(patternLength + 1);
        setPattern(addToPattern()); // Expand pattern for next round
        setGameStateVisual('player_win');
        setShowSuccessDelay(false);
      }, 1000); // Show green squares for 1 second
      return () => clearTimeout(timer);
    }
  }, [showSuccessDelay, pattern, visualScore, patternLength]);

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
              <label htmlFor='fname'>First name: </label><br />
              <input type='text' id='fname' name='fname' /><br />
              <label htmlFor='lname'>Last name: </label><br />
              <input type='text' id='lname' name='lname' /><br />
              <button>Submit</button>
            </form>
          </div>
        )}
        <h1>Human Benchmark</h1>
        <div className='header-buttons'>
          <button onClick={openLoginWindow} className='login-button'>SIGN UP</button>
          <button onClick={openSignUpWindow} className='login-button'>LOGIN</button>
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
          <h2>Number Memory Test</h2>
          {gameStateNumeric === 'initial' && (
            <button onClick={startGameNumeric}>Start game</button>
          )}
          {gameStateNumeric === 'countdown' && (
            <div>
              <p>Memorize the number</p>
              <p>{currentNumber}</p>
              <p>Time left: {countdownNumeric}</p>
            </div>
          )}
          {gameStateNumeric === 'player_input' && (
            <div>
              <input
                type="number"
                value={inputValueNumeric}
                onChange={handleInput}
                placeholder="Enter the number"
              />
              <button onClick={numericGameServerCheck}>Confirm</button>
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
                    className={`square ${gameStateVisual === 'show_pattern' && !isPatternGap && currentPatternIndex >= 0 && pattern[currentPatternIndex] === index ? 'pattern-active' :
                      (gameStateVisual === 'player_input' || showSuccessDelay) && playerInput.includes(index) ? 'selected' : ''
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
