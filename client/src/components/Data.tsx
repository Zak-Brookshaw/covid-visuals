import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { LineChart } from './Graphs/LineChart'
import { Sidebar } from './Shared/Sidebar'
import { getInit } from '../routes/GetInit';
import { getData } from '../routes/GetData';
import Plot from 'react-plotly.js';
import './Shared/shared.css';

type InitialType = {
    tableInfo: any,
    countries: string[]
}


export const Data = ()=>{
    const  [data, setData] = useState<any>({indepData: {date:[]}, depData: {cumulative_persons_vaccinated:[]}});
    const  [info, setInfo] = useState<InitialType | undefined>(undefined);
    const [control, setControl] = useState<any>({
        valid: false,
        newData: false,
        indepVar: undefined,
        depVar: undefined});

    const dataChange = (event: any) => {
        console.log(event)
    }

    useEffect(() =>{
        const initial = async () =>{
            const initResponse = await getInit();
            setInfo({... initResponse.data});
            const dataResponse = await getData(['date'], ['cumulative_persons_vaccinated']);
            setData({...dataResponse.data});
            console.log(dataResponse.data);
        };
        initial();
    }, [])

    useEffect(() =>{
        const newDataset = async () =>{
            const initResponse = await getInit();
            setInfo({... initResponse.data});
            getData(control.indepVar, control.depVar)
            .then((dataResponse)=>{
                setData({...dataResponse.data});
                console.log(dataResponse.data);
            })
            .catch((err)=>{
                console.log(err)
            })
            .then(()=>{
                setControl({
                    ...control,
                    newData: false,
                    indepVar: undefined,
                    depVar: undefined
                })
            });
        };
        if (control.newData){
            newDataset();
        }
        
    }, [control.newData])


    return (
        <Container fluid>
            <Row>
                <Col xs={1} id="sidebar-wrapper">                    
                    <Sidebar />
                </Col>
                <Col xs={10} id="page-content-wrapper">
                    <Plot 
                        data={[
                            {
                                x: data.indepData.date,
                                y: data.depData.cumulative_persons_vaccinated,
                                type: 'scatter',
                                mode: 'markers',
                            }
                        ]} 
                        layout={ {width: 1500, height: 700} }
                    /> 
                    <Form noValidate validated={control.valid} onSubmit={dataChange}>

                    </Form>
                </Col>
            </Row>


        </Container>
        )
}
