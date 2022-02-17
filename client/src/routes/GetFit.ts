import axios from 'axios';
export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const getFit = async (indepVar: string[], depVar: string[]) =>{
    const response: any = axios.get(`${SERVER_URL}/api/fit/fit-data`, {
        params: {
            indepVar,
            depVar: depVar[0],
        }
    });
    return response;
}