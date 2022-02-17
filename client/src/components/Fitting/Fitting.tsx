import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Plot from 'react-plotly.js';
import { Sidebar } from '../Shared/Sidebar';
import { getInit } from '../../routes/GetInit';
import { getFit } from '../../routes/GetFit';
import { SelectData } from './SelectData';

type InitialType = {
    tableInfo: any,
    locations: any,
}

export const Fitting = () =>{

    const  [data, setData] = useState<any>({date: [], y: [], y_hat: [], residuals: [], stats: {}});
    const  [info, setInfo] = useState<InitialType>({tableInfo: [], locations:{CA:[null]}});
    const [control, setControl] = useState<any>({
        valid: false,
        newData: false,
        indepVar: ['new_tested', 'new_deceased'],
        tmpIndepVar: ['new_tested', 'new_deceased'],
        depVar: ['new_recovered'],
        tmpDepVar: ['new_recovered'],
        country: 'CA',
        region: undefined,
        location_key: 'CA',
        layout:{
            width: 1500,
            height: 700,
            yaxis: {
                title: 'new recovered'
            }
        },
    });

    useEffect(() =>{
        const initial = async () =>{
            const initResponse = await getInit();
            setInfo({... initResponse.data});
            const fitResponse = await getFit(control.indepVar, control.depVar);
            console.log(fitResponse.data)
            setData({...fitResponse.data});
        };
        initial();
    }, [])

    useEffect(()=>{
        const getNewData = async ()=>{
            const fitResponse = await getFit(control.tmpIndepVar, control.tmpDepVar);
            setData({...fitResponse.data});
            let layout: any = {
                width: 1500,
                height: 700,
                yaxis: {
                    title: control.tmpDepVar[0].split('_').join(" ")
                },
                legend: {
                    x: 1.1,
                    y: 0.5
                  }
            }
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
                        // data={[
                        //     {
                        //         x: data.date,
                        //         y: data.y,
                        //         type: 'scatter',
                        //         mode: 'markers',
                        //         name: control.depVar[0],
                        //     },
                        //     {
                        //         x: data.date,
                        //         y: data.y_hat,
                        //         type: 'scatter',
                        //         mode: 'markers',
                        //         name: control.depVar[0],
                        //     }

                        // ]}
                        data={[
                            {
                                x: data.date,
                                y: data.residuals,
                                type: 'scatter',
                                mode: 'markers',
                                name: control.depVar[0],
                            },

                        ]}
                        layout={control.layout}
                        config={{responsive: true}}
                    /> 
                    <SelectData control={control} setControl={setControl} info={info} />
                </Col>
            </Row>
        </Container>
    )
}