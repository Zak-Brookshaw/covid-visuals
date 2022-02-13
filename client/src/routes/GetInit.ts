import axios from 'axios';
export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const getInit = async () => {
    const response: any = await axios.get(`${SERVER_URL}/api/data/initial-view`)
    return response;
};