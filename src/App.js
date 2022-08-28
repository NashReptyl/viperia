import React,{createContext, useState, useEffect} from 'react'
import { getUserDetails } from './utils/api';
import "./styles/pages/home.css";
import NavBar from './components/NavBar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import GuessWho from './pages/GuessWho';
import Lobby from './pages/Lobby';
import Game from './pages/Game';

export const UserContext = createContext('Unknown');

function App (){
  const [user, setUser] = useState('John Smith');
  const[loading, setLoading] = useState(true);
  useEffect ( () => {
    getUserDetails()
    .then(({data}) => {
        setUser(data);
        setLoading(false);
    })
    .catch(()=>{
      setLoading(false);
    })
  },[])
    return !loading && (
      <UserContext.Provider value={user}>
        <div>
        <Router>
        <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="/" element={<NavBar user={user} />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/guesswho" element={<GuessWho/>} />
              <Route path="/guesswho/lobby" element={<Lobby/>} />
              <Route path="/guesswho/game" element={<Game />} />
            </Route>
        </Routes>
      </Router>
      
        </div>
      </UserContext.Provider>
    )
  }

export default App;