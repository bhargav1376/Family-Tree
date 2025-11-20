import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components here
import Family from './Family/Family';


import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Family Tree route */}
          <Route path="/" element={<Family />} />
          <Route path="/family" element={<Family />} />
          
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
