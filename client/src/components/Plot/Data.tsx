import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { Sidebar } from '../Shared/Sidebar';
import { getInit } from '../../routes/GetInit';
import { getData } from '../../routes/GetData';
import Plot from 'react-plotly.js';
import { SelectData } from './SelectData';

type InitialType = {
    tableInfo: any,
    locations: any,
}

export const Data = ()=>{

    const [data, setData] = useState<any>({indepData: {date:[]}, depData: {cumulative_persons_vaccinated:[]}});
    const [info, setInfo] = useState<InitialType>({tableInfo: [], locations:{CA:[null]}});
    const [control, setControl] = useState<any>({
        valid: false,
        newData: false,
        indepVar: ['date'],
        tmpIndepVar: ['date'],
        depVar: ['cumulative_persons_vaccinated'],
        tmpDepVar: ['cumulative_persons_vaccinated'],
        country: 'CA',
        region: undefined,
        location_key: 'CA',
        layout:{
            width: 1500,
            height: 700,
            xaxis: {
                title: {
                    text: 'date'
                }
            },
            yaxis: {
                title: 'cumulative persons vaccinated'
            }
        },
    });

    useEffect(() =>{
        const initial = async () =>{
            const initResponse = await getInit();
            setInfo({... initResponse.data});
            const dataResponse = await getData(control.indepVar, control.depVar, control.location_key);
            setData({...dataResponse.data});

        };
        initial();
    }, [])

    useEffect(()=>{
        const getNewData = async ()=>{
            const dataResponse = await getData(control.tmpIndepVar, control.tmpDepVar, control.location_key);
            setData({...dataResponse.data});
            const xlabel = control.tmpIndepVar[0].split('_').join(" ");
            let layout: any = {
                width: 1500,
                height: 700,
                xaxis: {
                    title: {
                        text: xlabel
                    }
                },
                legend: {
                    x: 1.1,
                    y: 0.5
                  }
            }
            control.tmpDepVar.forEach((varName: string, index: number) => {
                const key: string = index > 0 ? `yaxis${index+1}` : 'yaxis';
                const ylabel = varName.split('_').join(" ");
                let side = 'left';
                let position = 0
                if (index > 0){
                    if ((index === 1 && control.tmpDepVar.length === 2) || index === 2){
                        side = 'right';
                        position = 1;
                        
                    }
                    else if(index === 1 && control.tmpDepVar.length > 2){
                        side = 'left';
                        position = 0.1;
                    }
                    else{  // index ==3
                        side =  'right'
                        position= 0.85
                    }
                    layout[key] = {
                        title: ylabel,
                        side, 
                        position,
                        overlaying: 'y1',
                    }
                }
                else{
                    layout[key] = {
                        title: ylabel,
                    }
                }
            });
            setControl({
                ...control,
                indepVar: control.tmpIndepVar,
                depVar: control.tmpDepVar,
                layout,
                newData: false
            });
        }

        if (control.newData){
            getNewData();
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
                        data = {control.depVar.map((varName: string, index: number)=>{
                            console.log(control);
                            console.log(data);
                            if (index > 0){
                                return {
                                    x: data.indepData[control.indepVar[0]],
                                    y: data.depData[varName],
                                    type: 'scatter',
                                    mode: 'markers',
                                    name: varName,
                                    yaxis: `y${index+1}`
                                }
                            }
                            else{
                                return {
                                    x: data.indepData[control.indepVar[0]],
                                    y: data.depData[varName],
                                    type: 'scatter',
                                    mode: 'markers',
                                    name: varName,
                                }
                            }
                        })}
                        layout={control.layout}
                        config={{responsive: true}}
                    /> 
                <SelectData 
                    info={info} 
                    control={control}
                    setControl={setControl}
                />
                </Col>
            </Row>

        </Container>
        )
}
