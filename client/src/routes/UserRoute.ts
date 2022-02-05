import axios from 'axios';
export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const getUsers = async () => {
    console.log(SERVER_URL);
    const response: any = await axios.get(`${SERVER_URL}/api`)
    return response;
}