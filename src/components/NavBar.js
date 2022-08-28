import {SignOutIcon} from '@primer/octicons-react'
import { Link, Outlet } from 'react-router-dom';

function NavBar (props){
    const logout = () => window.location.href = process.env.REACT_APP_API_URL+'/api/user/logout'
    return (
        <div>
        <nav className="navbar navbar bg-dark">
            <div className="container-fluid">
                <div className="navbar-header">
                    <Link className="navbar-brand" to={`/dashboard`}>
                    
                        <img height="40" alt="Brand" src={process.env.PUBLIC_URL + '/img/logo.png'}/>
                  
                    </Link>
                </div>
                <div className="dropdown show">
                    <a className="btn btn-secondary bg-dark border-0 shadow-none" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" data-bs-toggle="dropdown" aria-expanded="false">
                    <img
                        src={"https://cdn.discordapp.com/avatars/"+props.user.discordId+"/"+props.user.avatar+".png"}
                        className="rounded-circle profile" height="40"/>
                    {props.user.username}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <a className="dropdown-item" href={process.env.REACT_APP_API_URL+"/api/user/logout"} onClick={logout}>
                        <SignOutIcon size={16} verticalAlign="middle" /> <span>Logout</span></a>
                    </div>
                </div>
            </div>
        </nav><br/>
                <Outlet/>
                </div>
    )
}
export default NavBar;