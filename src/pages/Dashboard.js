import React, { useState, useEffect } from 'react'
import { getUserDetails } from '../utils/api';
import { useNavigate, Link } from "react-router-dom";

function Dashboard (){
    let navigate = useNavigate();

    const[loading, setLoading] = useState(true);

    useEffect ( () => {
        getUserDetails()
        .then(({}) => {
            setLoading(false);
        }).catch(() => 
        navigate('/home'))
    },[])

    return !loading && (
      <div className='div-games'>
        <Link className='games' style={{display:'inline-block'}} to={`/guesswho`}>
        <img className='img-guesswho' src={process.env.PUBLIC_URL+"/img/quiestce2.png"} height="300"/>
        </Link>
        <Link style={{display:'inline-block'}} to={`/dashboard`}>
        <img className='img-guesswho' src={process.env.PUBLIC_URL+"/img/construction.png"} height="300"/>
        </Link>
        <Link style={{display:'inline-block'}} to={`/dashboard`}>
        <img className='img-guesswho' src={process.env.PUBLIC_URL+"/img/construction2.png"} height="300"/>
        </Link>
      </div>
    )
  }

export default Dashboard;