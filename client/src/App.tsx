import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Data } from './components/Data';
// import { Sidebar } from './components/Shared/Sidebar'
function App() {
  
  return (
    <div>
      <Routes>
        <Route path="/test" element={<>Testing 1, 2, 3</>}/>
        <Route path='/' element={<Data />}>
        </Route>
      </Routes>  
    </div>
    

  );
}

export default App;