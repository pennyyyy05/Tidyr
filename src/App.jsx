import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CleanerProfile from "./pages/CleanerProfile";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

import "./App.css";
import AuthProvider from "./context/AuthContext";


function App() {
  return (
    <AuthProvider>
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cleaner-profile/:name" element={<CleanerProfile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
    </AuthProvider>
  );
}

export default App;