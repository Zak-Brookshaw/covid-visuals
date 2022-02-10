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
    locations: any,
}

export const Data = ()=>{
    const  [data, setData] = useState<any>({indepData: {date:[]}, depData: {cumulative_persons_vaccinated:[]}});
    const  [info, setInfo] = useState<InitialType>({tableInfo: [], locations:{CA:[null]}});
    const [control, setControl] = useState<any>({
        valid: false,
        newData: false,
        indepVar: ['date'],
        tmpIndepVar: ['date'],
        depVar: ['cumulative_persons_vaccinated'],
        tmpDepVar: ['cumulative_persons_vaccinated',],
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
    
    const dataChange = async (event: any) => {
        console.log(control.tmpDepVar);

        const dataResponse = await getData(control.tmpIndepVar, control.tmpDepVar, control.location_key);
        setData({...dataResponse.data});
        // handle control's state
        const xlabel = control.tmpIndepVar[0].split('_').join(" ");
        let layout: any = {
            width: 1500,
            height: 700,
            xaxis: {
                title: {
                    text: xlabel
                }
            },
        }
        control.tmpDepVar.forEach((varName: string, index: number) => {
            const key: string = index > 0 ? `yaxis${index+1}` : 'yaxis';
            const ylabel = varName.split('_').join(" ");
            let side = 'left';
            let position = 0
            if (index > 0){
                if ((index == 1 && control.tmpDepVar.length == 2) || index == 2){
                    side = 'right';
                    position = 1;
                    
                }
                else if(index == 1 && control.tmpDepVar.length > 2){
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
            layout
        });
    }

    useEffect(() =>{
        const initial = async () =>{
            const initResponse = await getInit();
            setInfo({... initResponse.data});
            const dataResponse = await getData(control.indepVar, control.depVar, control.location_key);
            setData({...dataResponse.data});
        };
        initial();
    }, [])

    return (
        <Container fluid>
            <Row>
                <Col xs={1} id="sidebar-wrapper">                    
                    <Sidebar />
                </Col>
                <Col xs={10} id="page-content-wrapper">
                    <Plot 
                        data = {control.depVar.map((varName: string, index: number)=>{
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
                    <Form 
                    noValidate 
                    validated={control.valid} 
                    // onSubmit={dataChange}
                    >
                        <Row className="mb-3" >
                            <Col xs={2}>
                                <Form.Label>Y-axis 1</Form.Label>
                                <Form.Control 
                                as="select" 
                                required 
                                value={control.tmpDepVar[0]}
                                onChange={(e)=>{
                                    
                                    setControl({
                                        ...control, 
                                        tmpDepVar: [...control.tmpDepVar.slice(0, 1, e.target.value)]
                                    })}}
                                >
                                    {info.tableInfo.map((row:any)=> {
                                        if (row.column_name !== 'index'){
                                            return (
                                                <>
                                                    <option>{row.column_name}</option>
                                                </>
                                            )
                                        }
                                    })}
                                </Form.Control>                               
                            </Col>
                            <Col xs={2}>
                                <Form.Label>Y-axis 2</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    
                                    onChange={(e)=>{
                                        const newDepVar = [...control.tmpDepVar];
                                        newDepVar.splice(1, 1, e.target.value);
                                        setControl({
                                            ...control, 
                                            tmpDepVar: control.tmpDepVar.length > 1 ? newDepVar : [...control.tmpDepVar].concat(e.target.value)
                                        })
                                    }}
                                >
                                    {info.tableInfo.map((row:any)=> {
                                        if (row.column_name !== 'index'){
                                            return (
                                                <>
                                                    <option>{row.column_name}</option>
                                                </>
                                            )
                                        }
                                    })}
                                </Form.Control>                               
                            </Col>
                            <Col xs={2}>
                                <Form.Label>Y-axis 3</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    onChange={(e)=>{
                                        const newDepVar = [...control.tmpDepVar];
                                        newDepVar.splice(2, 1, e.target.value);
                                        setControl({
                                            ...control, 
                                            tmpDepVar: control.tmpDepVar.length > 2 ? newDepVar : [...control.tmpDepVar].concat(e.target.value)
                                    })}}
                                
                                >
                                    {info.tableInfo.map((row:any)=> {
                                        if (row.column_name !== 'index'){
                                            return (
                                                <>
                                                    <option>{row.column_name}</option>
                                                </>
                                            )
                                        }
                                    })}
                                </Form.Control>                               
                            </Col>
                            <Col xs={2}>
                                <Form.Label>Y-axis 4</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    onChange={(e)=>{
                                        const newDepVar = [...control.tmpDepVar];
                                        newDepVar.splice(3, 1, e.target.value);
                                        setControl({
                                            ...control, 
                                            tmpDepVar: control.tmpDepVar.length > 3 ? newDepVar : [...control.tmpDepVar].concat(e.target.value)
                                    })}}
                                >
                                    {info.tableInfo.map((row:any)=> {
                                        if (row.column_name !== 'index'){
                                            return (
                                                <>
                                                    <option>{row.column_name}</option>
                                                </>
                                            )
                                        }
                                    })}
                                </Form.Control>                               
                            </Col>
                        </Row>     

                        <Row className="mb-3" >
                            <Col xs={2}>
                                <Form.Label>X-axis</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    value={control.tmpIndepVar[0]} 
                                    onChange={
                                        (e)=>{setControl({...control, tmpIndepVar:[e.target.value]})}
                                        }
                                >
                                    {info.tableInfo.map((row:any)=> {
                                        if (row.column_name !== 'index'){
                                            return (
                                                <>
                                                    <option >{row.column_name}</option>
                                                </>
                                            )
                                        }
                                    })}
                                </Form.Control>                               
                            </Col>
                        </Row> 
                        
                        <Row className="mb-3">
                            <Col xs={1}>
                                <Form.Control as="select" onChange={(e)=>{
                                    setControl({
                                        ...control,
                                        country:e.target.value,
                                        location_key: e.target.value
                                    })}}
                                >
                                    {Object.keys(info.locations).map((row:any)=> {
                                        return (
                                            <>
                                                <option>{row}</option>
                                            </>
                                        )
                                    })}
                                </Form.Control>                                 
                            </Col>
                            <Col xs={1.5}>
                                <Form.Control as="select" onChange={(e)=>{
                                    setControl({
                                    ...control,
                                    region: e.target.value !== "all regions" ? e.target.value : "",
                                    location_key: e.target.value !== "all regions"  ? control.country.concat("_", e.target.value) : control.country
                                    })}}>
                                    {info.locations[control.country].map((row:any)=> {

                                        return (
                                            <>
                                                <option>{row!== null ? row : "all regions"}</option>
                                            </>
                                        )
                                    })}
                                </Form.Control>                                 
                            </Col>
                            
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Button 
                                    onClick={dataChange}
                                    >
                                        Select Data
                                </Button>
                            </Col>
                            
                        </Row>
                    </Form>
                </Col>
            </Row>

        
        </Container>
        )
}
