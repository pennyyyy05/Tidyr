import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

export default function Auth(){
    const [mode, setMode] = useState("signup"); // "login" or "signup"
    const [serverError, setServerError] = useState("");

    const navigate = useNavigate();

    const { signUp, login } = useAuth();
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors },
    } = useForm();

    async function onSubmit(data) {
    setServerError("");
        try {
            if (mode === "signup") {
                await signUp(data.email, data.password);
                navigate("/");
            } else {
                const result = await login(data.email, data.password);
                if (result.isAdmin) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        } catch (err) {
            setServerError(err.message);
        }
    }

    return (
    <div className="page">
        <div className="auth-logo">Tidyr</div>
        <div className="container">
            <div className="auth-container">
                
                <h1 className="page-title">{mode === "signup" ? "Sign Up" : "Login"}
                </h1>

                {serverError && <div className="error-message">{serverError}</div>}

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input 
                            className="form-input" 
                            type="email" 
                            id="email" 
                            {...register('email', { required: "Email is required"})} 
                        />
                        {errors.email && (
                            <span className="form-error">{errors.email.message}</span> 
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input 
                            {...register('password', {
                                required: "Password is required", minLength: { 
                                    value: 6, 
                                    message: "Password must be at least 6 characters" 
                                }, 
                                maxLength: { 
                                    value: 12, 
                                    message: "Password must be at most 12 characters" 
                                },
                            })} 
                            className="form-input" 
                            type="password" 
                            id="password" 
                        />
                        {errors.password && (
                            <span className="form-error">{errors.password.message}</span>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" >{mode === "signup" ? "Sign Up" : "Login"} 
                    </button>
                </form>

                <div className="auth-switch">
                    {mode === "signup" ? ( 
                        <p>
                            Already have an account? {" "}
                            <span className="auth-link" onClick={() => setMode("login")}>
                                Login
                            </span>
                        </p>
                    ) : (
                        <p>
                            {" "}
                            Don't have an account? {" "}
                            <span className="auth-link" onClick={() => setMode("signup")}>
                                Sign Up
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}