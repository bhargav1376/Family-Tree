import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import './App.css';
import Family from './Family/Family';

function App() {
  return (
    <Router>
      {/* Analytics MUST be here (inside Router, outside Routes) */}
      <Analytics />

      <Routes>
        <Route path="/" element={<Family />} />
        <Route path="/family" element={<Family />} />
      </Routes>
    </Router>
  );
}

export default App;
