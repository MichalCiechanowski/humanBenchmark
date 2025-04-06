import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


export  function NumericGame() {
  const [randomNumber , setRandomNumber] = useState(null);
  const [userInput , setUserInput] = useState('');
  const [isDisplaying , setIsDisplaying] = useState(false);
  const [count , setCount] = useState(0);
  const [message , setMessage] = useState('');
  const fetchRandomNumebr = async (count) =>{

      try{
          const response = await axios.get(`/api/random_number/${count}`);
          setRandomNumber(response.data.number);
          setIsDisplaying(true);
          setUserInput('');
          setMessage('');
          const displayTime = 5000;
          setTimeout(() =>{
            setIsDisplaying(false);
            },displayTime);
      } catch(error){
          alert('Error with fetching numbers' ,error)
      }
  }
  const checkAnswear = () =>{
    if (userInput === randomNumber?.toString()){
      setMessage('Correct');
      setCount(count => count+1)
    }else{
      setMessage('Incorrect')
      setCount(Math.max(0 , count-1));
    }
  }

  return (
    <main>
      <header>

       <Link to= "/"> <h1>Human Benchamrk</h1></Link>

        <div className='header-buttons'>
          <button className='login-button'>SING UP</button>
          <button className='login-button'>LOGIN</button>
        </div>
      </header>
      <div className='game'>
      {isDisplaying ? (
        <div className="numberdisplay">
          <p>Remember this number</p>
          <div className="number">{randomNumber}</div>
        </div>
      ):randomNumber?(
        <div className="input">
          <input
          type='text'
          value={userInput}
          onChange={(n)=> setUserInput(n.target.value)}
          placeholder='Enter the number you saw' />
        <button onClick={checkAnswear}>Check your answear</button>
        </div>):null} 
        <button
        onClick={()=>fetchRandomNumebr(count)}
        disabled ={isDisplaying}
        >
          {randomNumber ? 'Generate New number':'Start Game'}
        </button>
        {message && <p className='mess'>{message}</p>} 
      </div>
    </main>
  );
}


