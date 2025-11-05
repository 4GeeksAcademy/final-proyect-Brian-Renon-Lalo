import React, { useState } from "react";
import { login } from "./../services/fetch";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const RZLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState ("");
    const [success, setSuccess] = useState ("");
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password, dispatch);
        setError("");
        setSuccess("");


            if (!data.token || !data.user?.id) {
                throw new Error("Invalid login response");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user.id);
          


            setSuccess("Login successfully ✔");
            console.log("User logued:", data);

            setTimeout(() => {
                navigate("/rzelection");
            },1000);
            
            } catch (err) {
                setError("Wrong Credentials ❌");
            }
        };


    return (
        <div className="login-container d-flex flex-column align-items-center justify-content-center p-4">
            <h2>Iniciar Sesión</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}> 
                    <div className="mb-3">
                        <label htmlFor="login-email">Email</label>
                        <input className="form-control" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="login-password">Contraseña</label>
                        <input className="form-control" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}required/>
                    </div>    
                    <button type="submit" className="btn">Iniciar Sesión</button>
                </form>
            
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <p>Si no estas resgistrado, por favor dirigete a <Link to="/register">registrar</Link></p>
            </div>
        </div>
    );
};