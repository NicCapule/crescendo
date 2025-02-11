import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
            </Route>
            <Route path="login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
