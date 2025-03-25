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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{message || 'Loading...'}</h1>
    </div>
  );
}

export default App;
