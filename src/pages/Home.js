import React, { useState } from 'react'
import { getUserDetails } from '../utils/api';
import { useNavigate } from "react-router-dom";

function Home(){
    //Only if user isn't connected, otherwise -> /dashboard    
    let navigate = useNavigate();
    const[loading, setLoading] = useState(true);
    React.useEffect ( () => {
        getUserDetails()
        .then(() => {
            navigate('/dashboard')
        }).catch((err) => {
          setLoading(false);})
    },[])
    
    const login = () => window.location.href = process.env.REACT_APP_API_URL+'/api/user/login'
    return !loading && (
      <div>
          <img alt="viperia" className='img-titre'src={process.env.PUBLIC_URL + '/img/titre.png'} />
        
        <div className='connection'>
          <button className='button-login' onClick = {login}>Connexion
          <img alt="discord" className='img-discord' src={process.env.PUBLIC_URL + '/img/discord.png'} /></button>
        </div>
      </div>
    )
  }

export default Home;