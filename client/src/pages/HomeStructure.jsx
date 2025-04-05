import { Link } from "react-router-dom";

export  function Structure(){
  return(
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
      <Link to="/NumericGame"><button>Start game</button> </Link>
      <p className='game-description'>
        Test will check how good is your Number memory. During test you will be presented with numbers of increasing length, you have to memorize it during 5 seconds and type the number. How far can you get?
      </p>
    </div>
  </main>
  );
};
