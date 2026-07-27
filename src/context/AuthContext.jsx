import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export default function AuthProvider({ children }){

    const [user, setUser] = useState(null);

    async function signUp(email, password) {
        const response = await fetch("http://localhost/tidyr-api/signup.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Signup failed");
        }

        setUser({ email });
        return result;
    }

    async function login(email, password) {
        const response = await fetch("http://localhost/tidyr-api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Login failed");
        }

        setUser({ email: result.email, isAdmin: result.isAdmin });
        return result;
    }

    function logout() {
        setUser(null);
    }


    return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>{children}
    </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    return context; 
}