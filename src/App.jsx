import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CleanerProfile from "./pages/CleanerProfile";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

import "./App.css";


function App() {
  return <div className="app">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/cleaner-profile/:id" element={<CleanerProfile />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </div>;
}

export default App;