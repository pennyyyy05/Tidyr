import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar(){

    const { user, logout } = useAuth();

    return <nav className="navbar">
        <div className="navbar-container">
            <Link to="/" className="navbar-brand">
                Tidyr
            </Link>
            
            <div className="navbar-auth">
                {!user ?  <div className="navbar-auth-links">
                <Link to="/auth" className="btn btn-primary"> Login or Signup</Link>
                </div>
                : (
                    <div classname= "navbar-user">
                        <button className="btn btn-secondary" onClick={logout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    </nav>
}