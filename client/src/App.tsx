
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Data } from './components/Plot/Data';
import { Fitting } from './components/Fitting/Fitting';

// import { Sidebar } from './components/Shared/Sidebar'
function App() {
  
  return (
    <div>
      <Routes>
        <Route path="/test" element={<>Testing 1, 2, 3</>}/>
        <Route path='/' element={<Data />} />
        <Route path='/fit' element={<Fitting />} />
      </Routes>  
    </div>
    

  );
}

export default App;