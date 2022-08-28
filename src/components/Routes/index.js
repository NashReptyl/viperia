import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from '../../pages/Dashboard';
import Home from '../../pages/Home';
import GuessWho from '../../pages/GuessWho';
import Lobby from '../../pages/Lobby';
import Game from '../../pages/Game';
import NavBar from '../NavBar';

const index = () =>{
    return (
      <Router>
        <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="/" element={<NavBar/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/guesswho" element={<GuessWho/>} />
              <Route path="/guesswho/lobby" element={<Lobby/>} />
              <Route path="/guesswho/game" element={<Game />} />
            </Route>
        </Routes>
      </Router>
    )
  }

export default index;