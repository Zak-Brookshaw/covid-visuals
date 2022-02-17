import React from "react";
import { Nav, Button } from "react-bootstrap";
import './shared.css';


export const Sidebar = () => {
    return (
        <>
            <Nav className="col-md-12 d-none d-md-block bg-light sidebar">
                <Nav.Item>
                    <Nav.Link href="/">Plotting</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/fit">Fitting</Nav.Link>
                </Nav.Item>
            </Nav>
          
        </>
    )
}