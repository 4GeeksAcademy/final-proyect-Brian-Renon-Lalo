import React, { useState } from "react";
import { login } from "./../services/fetch";
import { Link, useNavigate } from "react-router-dom";


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState ("");
    const [success, setSuccess] = useState ("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
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
                navigate("/profile");
            },1000);
            
            } catch (err) {
                setError("Wrong Credentials ❌");
            }
        };


    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="login-email">Email</label>
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <label htmlFor="login-password">Password</label>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}required/>
                
                <button type="submit">Log In</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <p>If you aren't registered, please <Link to="/register">register</Link></p>
        </div>
        
    );
};