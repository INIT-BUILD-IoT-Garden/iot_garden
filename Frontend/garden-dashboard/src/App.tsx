import { Route, HashRouter as Router, Routes } from "react-router-dom";

import { AboutUs } from "./pages/AboutUs";
import { Home } from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
