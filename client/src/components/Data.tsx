import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { LineChart } from './Graphs/LineChart'
import { getInit } from '../routes/GetInit';
import { getData } from '../routes/GetData';
import Plot from 'react-plotly.js';


type InitialType = {
    tableInfo: any,
    countries: string[]
}


export const Data = ()=>{
    const  [data, setData] = useState<any>({});
    const  [info, setInfo] = useState<InitialType | undefined>(undefined);

    useEffect(() =>{
        const initial = async () =>{
            const initResponse = await getInit();
            setInfo({... initResponse.data});
            const dataResponse = await getData(['date'], ['cumulative_persons_vaccinated']);
            setData({...dataResponse.data})
            console.log(dataResponse.data)
        };
        initial();
        console.log(data)
    }, [])

    return (
        <>
            <Plot 
                data={[
                    {
                        x: data.indepData.date,
                        y: data.depData.cumulative_persons_vaccinated,
                        type: 'scatter',
                        mode: 'markers',
                    }
                ]} 
                layout={ {width: 1000, height: 700} }
            />
        </>)
}
