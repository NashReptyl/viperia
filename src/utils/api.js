import axios from "axios";

export function getUserDetails(){
    return axios.get(process.env.REACT_APP_API_URL+"/api/user", {
        withCredentials: true
    });
}

export function getCharacters(){
    return axios.get(process.env.REACT_APP_API_URL+"/api/character", {
        withCredentials: true
    });
}