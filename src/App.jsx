import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

import "./App.css";
import AuthProvider from "./context/AuthContext";
import CleanerDetails from "./pages/CleanerDetails";
import ProtectedRoute from "./components/ProtectRoute";


function App() {
  return (
    <AuthProvider>
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cleaner-profile/:id" element={<CleanerDetails />} 
        />
        <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
        />
        </Routes>
    </div>
    </AuthProvider>
  );
}

export default App;