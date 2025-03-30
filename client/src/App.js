import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  const fetchMessage = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get('/api/message');
        setMessage(response.data.message);
        return;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error.message);
        if (i === retries - 1) {
          console.error('All retries failed');
          setMessage('Error: Unable to fetch message');
        } else {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <main>
      <header>
        <h1>Human Benchamrk</h1>
        <div className='header-buttons'>
          <button className='login-button'>SING UP</button>
          <button className='login-button'>LOGIN</button>
        </div>
      </header>
      <div className='game'>
        <h2>Number Memory</h2>
        <button>Start game</button>
        <p className='game-description'>
          Test will check how good is your Number memory. During test you will be presented with numbers of increasing length, you have to memorize it during 5 seconds and type the number. How far can you go?
        </p>
      </div>
    </main>
  );
}

export default App;
