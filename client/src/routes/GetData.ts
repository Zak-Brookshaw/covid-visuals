import axios from 'axios';
export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const getData = async (indepVar: string[], depVar: string[]) => {
    const response: any = await axios.get(`${SERVER_URL}/api/get-data`, {
        params:{
            indepVar,
            depVar
        }
    })
    return response;
};