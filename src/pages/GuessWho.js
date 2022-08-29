import React, { useEffect, useState } from 'react'
import { getUserDetails } from '../utils/api';
import { useNavigate, Link } from "react-router-dom";
import randomCodeGenerator from '../utils/randomCodeGenerator'
import { useContext } from 'react';
import { UserContext } from '../App';

function GuessWho(){
    const user = useContext(UserContext);
    const[roomCode, setRoomCode] = useState('')

    let navigate = useNavigate();
    const[loading, setLoading] = useState(false);


    return !loading && (
      <div className='page-guess'>
        <div className='base-guess'>
            <div className='titre-guess'>
                <span className='span-guess'>Qui est-ce ?</span>
            </div>
            <div className='photo-guess'>
            <img
             src={"https://cdn.discordapp.com/avatars/"+user.discordId+"/"+user.avatar+".png"}
             className="rounded-circle" height="100"/><br/>
             <span className='pseudo-guess'>{user.username}</span>
            </div>
            <div className='code-guess'>
                <input type='text' placeholder='Game Code' onChange={(event) => setRoomCode(event.target.value)} />
            </div>
            <div className='join-guess'>
                <Link className='d-grid gap-2' to={`/guesswho/lobby?roomCode=${roomCode}`}>
                    <button type="button" className="btn btn-primary">JOIN GAME</button>
                </Link>
            </div>
            <div className='create-guess'>
                <Link className='d-grid gap-2' to={`/guesswho/lobby?roomCode=${randomCodeGenerator(5)}`}>
                    <button type="button" className="btn btn-success">CREATE GAME</button>
                </Link>
            </div>
                
        </div>
        
      </div>
    )
  }

export default GuessWho;