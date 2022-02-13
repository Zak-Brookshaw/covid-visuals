import React from "react";
import { Button, Row, Col, Form } from 'react-bootstrap';
import { BackspaceFill, PlusCircleFill } from 'react-bootstrap-icons';
type YaxisType = {
    control: any;
    setControl: any;
    info: any;
    dataChange: any
}

export const SelectData: React.FC<YaxisType>  = ({control, setControl, info, dataChange}) =>{
    return (
        <>
        <Form 
            noValidate 
            validated={control.valid} 
        >
            <Row 
            className="mb-3 align-items-end"
            >
                {control.tmpDepVar.map((varName: string, index: number) =>{
                    return(
                        <Col xs={2}>
                            <Form.Label>
                                Y-axis {index + 1}
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={control.tmpDepVar[index]}
                                onChange={(e)=>{
                                    const newDepVar = [...control.tmpDepVar];
                                    newDepVar.splice(index, 1, e.target.value);
                                    setControl({
                                        ...control, 
                                        tmpDepVar: control.tmpDepVar.length > index ? newDepVar : [...control.tmpDepVar].concat(e.target.value),
                                        newData: true,
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
                                    else{
                                        return null
                                    }
                                })}
                            </Form.Control>
                        </Col>

                    )
                })}
                <Col className="align-self-end d-flex">
                {
                    control.tmpDepVar.length > 1 ?
                    
                    <Button 
                    style={{marginRight:'1%'}}
                    onClick={async ()=>{
                        if (control.tmpDepVar.length > 1){
                            let tmp: string[] = [...control.tmpDepVar];
                            tmp.pop()
                            await setControl({
                                ...control,
                                tmpDepVar: tmp,
                                newData: true,
                            }
                            )
    
                        }
                    }}>
                        <BackspaceFill/>
                    </Button>
                    // </Col>
                    :
                    null
                }

                {
                    control.tmpDepVar.length < 4 && !control.tmpDepVar.includes(null) ?
                    // <Col className="align-self-end d-flex" >
                        <Button onClick={async ()=>{  
                            await setControl({
                                ...control,
                                tmpDepVar: [...control.tmpDepVar].concat(null),
                                // newData: true,
                            })
                        }}>
                            <PlusCircleFill />
                        </Button>  
                             
                    :
                    null        
                }
                </Col> 
            </Row>

            <Row className="mb-3" >
                <Col xs={2}>
                    <Form.Label>X-axis</Form.Label>
                    <Form.Control 
                        as="select" 
                        value={control.tmpIndepVar[0]} 
                        onChange={
                            (e)=>{setControl({
                                ...control, 
                                tmpIndepVar:[e.target.value],
                                newData: true,
                            })}
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
                            location_key: e.target.value,
                            newData: true,
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
                        location_key: e.target.value !== "all regions"  ? control.country.concat("_", e.target.value) : control.country,
                        newData: true,
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
        </Form>

        </>)
}