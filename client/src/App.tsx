import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  
  return (
    <div>
      <Routes>
        <Route path="/test" element={<>Testing 1, 2, 3</>}/>
        <Route path='/' >
        </Route>
      </Routes>      
    </div>


  );
}

export default App;
