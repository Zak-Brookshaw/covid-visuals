import React from "react";
import { Button, Row, Col, Form } from 'react-bootstrap';
import { BackspaceFill, PlusCircleFill } from 'react-bootstrap-icons';


type YaxisType = {
    control: any;
    setControl: any;
    info: any;
}

export const SelectData: React.FC<YaxisType> = ({control, setControl, info}) =>{
    return (
        <Form
            noValidate 
        >
            <Row className="mb-3" >
                <Col xs={2}>
                    <Form.Label>Model Output</Form.Label>
                    <Form.Control 
                        as="select" 
                        value={control.tmpDepVar[0]} 
                        onChange={
                            (e)=>{setControl({
                                ...control, 
                                tmpDepVar:[e.target.value],
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
            <Row className="mb-3 align-items-end">
                {
                    control.tmpIndepVar.map((varName: string, index: number) =>{

                        return(
                            <Col xs={2}>
                                <Form.Label>
                                    Factor {index + 1}
                                </Form.Label>

                                <Form.Control
                                as="select"
                                value={control.tmpIndepVar[index]}
                                onChange={(e)=>{
                                    const newDepVar = [...control.tmpIndepVar];
                                    newDepVar.splice(index, 1, e.target.value);
                                    setControl({
                                        ...control, 
                                        tmpIndepVar: control.tmpIndepVar.length > index ? newDepVar : [...control.tmpIndepVar].concat(e.target.value),
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
                    })
                }
                <Col className="align-self-end d-flex">
                    {
                        control.tmpIndepVar.length > 1 ?
                        
                        <Button 
                        style={{marginRight:'1%'}}
                        onClick={async ()=>{
                            if (control.tmpIndepVar.length > 1){
                                let tmp: string[] = [...control.tmpIndepVar];
                                tmp.pop()
                                await setControl({
                                    ...control,
                                    tmpIndepVar: tmp,
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
                        control.tmpIndepVar.length < 4 && !control.tmpIndepVar.includes(null) ?
                        // <Col className="align-self-end d-flex" >
                            <Button onClick={async ()=>{  
                                await setControl({
                                    ...control,
                                    tmpIndepVar: [...control.tmpIndepVar].concat(null),
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
        </Form>
    )
}