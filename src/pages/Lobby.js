import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { getUserDetails,getCharacters } from '../utils/api';
import { useLocation, useNavigate, Link } from "react-router-dom";
import queryString from 'query-string'
import { useContext } from 'react';
import { UserContext } from '../App';
import ReactLoading from 'react-loading';

let socket;

function Lobby(){
  const user = useContext(UserContext);
  const [player1, setPlayer1] = useState(UserContext)
  const location = useLocation();
  const data = queryString.parse(location.search)
  const URL = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();

  /* STATE OF THE PAGE */

  const[loading, setLoading] = useState(true);
  const[started, setStarted] = useState(false);

  useEffect ( () => {
    getUserDetails()
    .then(({}) => {
      setLoading(false);
    }).catch((err) => 
      navigate('/home'));
  },[])


  /* SOCKET INITIALISATION */
    
  const [room, setRoom] = useState(data.roomCode)
  const [roomFull, setRoomFull] = useState(false)
  const [nbPlayer, setNbPlayer] = useState(1)
  const [player2, setPlayer2] = useState(null)

  useEffect(() => {
    const connectionOptions =  {
      "forceNew" : true,
      "reconnectionAttempts": "Infinity", 
      "timeout" : 10000,                  
      "transports" : ["websocket"]
    }
    socket = io.connect(URL, connectionOptions)
        
    socket.emit('join', {room: room, user: user.username, discordId:user.discordId, avatar:user.avatar}, (error) => {
       if(error)
          setRoomFull(true)
    })

    socket.on('roomData', (payload, cb) => {
      setNbPlayer(payload.users.length)
      if(payload.users.length ==2){
        setPlayer1(payload.users[0])
        setPlayer2(payload.newUser)
      }
      else{
        setPlayer1(payload.users[0])
        setStarted(false);
        getCharacters()
        .then(({data}) =>{
          setCharacters(data.characters);
          setReponseAdversaire(data.reponses[0]);
          setReponseJoueur(data.reponses[1]);
        })
      }
    })

    return function cleanup() {
      socket.disconnect()
      socket.off()
    }
  }, [])


  /* GAME PARAMETERS  */
  const[characters, setCharacters] = useState([]);
  const[reponseAdversaire, setReponseAdversaire] = useState('');
  const[reponseJoueur, setReponseJoueur] = useState('');
  const[charactersLeft, setcharactersLeft] = useState([]);
  
  const removeCharacter = (name) => {
    setcharactersLeft(charactersLeft.filter(c => {
        return c !== name;
      }),
    );
  }

  const initCharactersLeft = (persos) => {
    persos.map((perso) => 
      charactersLeft.push(perso.name)
    )
  }

  useEffect(()=>{
    socket.on('list-characters', (payload)=>{
      setCharacters(payload.characters)
      initCharactersLeft(payload.characters)
      if(user.username==payload.p2.username){
        setStarted(true);
        setReponseAdversaire(payload.reponses[1]);
        setReponseJoueur(payload.reponses[0]);
      }
    })

    socket.on('return', (payload)=>{
      if(user.username!==payload.player){
        let i = payload.number
        const choice = document.getElementById('c-'+i);
        const not = document.getElementById('n-'+i);
        choice.classList.toggle('cross');
        not.classList.toggle('cross');
      }
    })

    socket.on('resultat', (payload)=>{
      if(user.username!==payload.user.username){
        document.getElementById('choix').classList.toggle('cross');
        if (payload.victoire)
          document.getElementById('victoire').classList.toggle('cross');
        else
          document.getElementById('defaite').classList.toggle('cross');
      }
    })
  },[])

  //User start the game
  const gameStarted = () => {
    const reponseEnvoyée = [];
    reponseEnvoyée.push(reponseAdversaire);
    reponseEnvoyée.push(reponseJoueur);
    socket.emit('start', {room:room, characters:characters, player2:player2, reponses: reponseEnvoyée})
    setStarted(true);
  }

  //Add or remove a characters after being selected
  const handleSelectInput = (i) => {
    const perso = characters[i].name;
    if (charactersLeft.includes(perso))
      removeCharacter(perso);
    else
      setcharactersLeft(charactersLeft.concat(perso));
  }

  //User select an image
  const select = (i) =>{
    handleSelectInput(i);
    const image = document.getElementById('img-'+i);
    image.classList.toggle("grey");
    image.classList.toggle("img-perso");
    const croix = document.getElementById('cross-'+i);
    croix.classList.toggle('cross');

    socket.emit("select", {number:i, player:user.username, room:room});
  }

  //User validate his response
  const validate = () =>{
    let victoire=true;
    document.getElementById('choix').classList.toggle('cross');
    if (document.getElementById('inputResponse').value == reponseJoueur.name){
      document.getElementById('victoire').classList.toggle('cross');
      victoire = false;
    }
    else
      document.getElementById('defaite').classList.toggle('cross');
    socket.emit('fin', {user:user, victoire:victoire, room:room});
  }
    
  return !loading && (
    <div>
      {!started ? (
      <div className='page-guess'>
        <div className='base-guess'>
          <div className='titre-guess'>
            <span className='span-code'>Game Code: {room}</span>
          </div>

          <div className='player-lobby'>
            <div className='player'>
              <img src={"https://cdn.discordapp.com/avatars/"+player1.discordId+"/"+player1.avatar+".png"}
                className="rounded-circle" height="100"/><br/>
              <span className='pseudo-guess'>{player1.username}</span>
            </div>
            <div className='player'>
              {nbPlayer===2 ? (
              <><img src={"https://cdn.discordapp.com/avatars/" + player2.discordId + "/" + player2.avatar + ".png"}
                className="rounded-circle" height="100" /><br />
              <span className='pseudo-guess'>{player2.username}</span></>
              ) : (
              <><span className='waiting'>Waiting <br/> Opponent 
                <ReactLoading className="loading" type={'bubbles'} color={'white'} height={20} width={30} /></span>
              </>
              )}
            </div>
          </div>

          <div className='start-lobby d-grid gap-2 col-6 mx-auto'>
            {nbPlayer===2 && player1.username==user.username ? (
            <button onClick={gameStarted} type="button" className="btn btn-primary">START</button>
            ) : (
            <button type="button" className="btn btn-primary disabled">START</button>
            )} 
          </div>

          <div className='quit-lobby'>
            <Link className='d-grid gap-2 col-6 mx-auto' to={`/guesswho`}>
              <button type="button" className="btn btn-danger">QUIT</button>
            </Link>
          </div>                
        </div>        
      </div>
      ) :(
      <div className='guess-game'>

        <div className="row plateau">
          <h1> Qui est-ce ?</h1>
          {characters.map((perso, index) => 
          <div className="col-md-2 col-sm-4  col-4">
            <div id={'img-'+index} className='card img-perso' onClick={() => select(index)}>
              <img className="img-fluid card-img" src={process.env.PUBLIC_URL + '/img/characters/' + perso.image} />
              <img id={'cross-' + index} className="img-fluid card-img-overlay cross cross-image " src={process.env.PUBLIC_URL + '/img/characters/cross.png'} />
              <span className="card-text">{perso.name} </span>
              <small className="text-muted">{perso.anime}</small>
            </div>
          </div>
          )}
        </div>
        
        <div className='right-part'>
          <div>
            <h1>Votre adversaire doit deviner:</h1>
            <div className='card card-deviner'>
              <img className="card-img" src={process.env.PUBLIC_URL + '/img/characters/' + reponseAdversaire.image} />
              <span className="card-text">{reponseAdversaire.name} </span>
              <small className="text-muted">{reponseAdversaire.anime}</small>
            </div>
          </div>

          <div id="victoire" className="alert alert-success cross" role="alert">
            <h4 className="alert-heading">Victoire</h4>
            <p>Vous avez gagné </p>
            <hr/>
            <Link className='btn-fin' onClick={() => window.location.reload()} to={`/guesswho/lobby?roomCode=${room}`}>
              <button type="button" className="btn btn-outline-success">Retour lobby</button>
            </Link>
            <Link className='' to={`/guesswho`}>
              <button type="button" className="btn btn-outline-success">Quitter</button>
            </Link>
          </div>

          <div id="defaite" className="alert alert-danger cross" role="alert">
            <h4 className="alert-heading">Defaite</h4>
            <p>La bonne réponse était : {reponseJoueur.name}</p>
            <hr/>
            <Link className='btn-fin' onClick={() => window.location.reload()} to={`/guesswho/lobby?roomCode=${room}`}>
              <button type="button" className="btn btn-outline-danger">Retour lobby</button>
            </Link>
            <Link className='' to={`/guesswho`}>
              <button type="button" className="btn btn-outline-danger">Quitter</button>
            </Link>
          </div>

          <div id='choix' className="input-group mx-auto">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputResponse">Réponse</label>
            </div>
            <select className="custom-select" id="inputResponse">
              <option selected>Choose...</option>
              {charactersLeft.map((perso) => 
              <option value={perso}>{perso}</option>
              )}
            </select>
            <button type="button" onClick={validate} className="btn btn-primary">Valider</button>
          </div>
          
          <h1>Plateau adverse</h1>
          <div className='row choice'>
            {characters.map((perso, index) => 
            <div className="minimap col-md-2 col-sm-4 col-4">
              <img id={'c-'+index} className="cross img-fluid img-choice" src={process.env.PUBLIC_URL + '/img/choice.png'} />
              <img id={'n-'+index} className="img-fluid img-not" src={process.env.PUBLIC_URL + '/img/not.png'} />
            </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default Lobby;