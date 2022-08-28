import { Outlet, Navigate } from 'react-router-dom'
import { getUserDetails } from '../utils/api';

const PrivateRoutes = () => {
    let auth = true
    let user= getUserDetails()
    console.log(user)
/* 
    getUserDetails()
    .then((data) => {
        user = (data.data);
        console.log(user.username)
        auth = true;
    }).catch((err) => {
      auth = false;
    }) */

    return(
        auth ? <Outlet context={user}/> : <Navigate to="/"/>
    )
}

export default PrivateRoutes