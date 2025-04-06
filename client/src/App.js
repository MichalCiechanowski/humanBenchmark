import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {HashRouter as Router , Route , Routes } from 'react-router-dom';
import { Structure} from './pages/HomeStructure';
import { NumericGame } from './NumericPage';
function App() {


  return (
    <Router>
      <Routes>
        <Route path='/'element= {<Structure />}/>
        <Route path='/numericgame' element = {<NumericGame/>}/>
      </Routes>
    </Router>

  

  );


}

export default App;
