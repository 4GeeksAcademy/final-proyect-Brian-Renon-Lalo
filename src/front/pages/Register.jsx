import { useState } from "react";
import { register } from "./../services/fetch";
import { Link, useNavigate } from "react-router-dom";




export const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState ("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState ("");
    const [success, setSuccess] = useState (""); 
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try{
            const data = await register(email,password);
            setSuccess("Register completed successfully ✅");
            setTimeout(() => {
            navigate("/login");
            },2000);
        } catch (err) {
            setError("Error trying to register❌");
        }
    };


    return (
        <div className="Register-container">
            <h2>Register:</h2>    
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">name</label>
                        <input type="text" id="name" value={name} placeholder="name" onChange={(e) => setName(e.target.value)} required/>
                    <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} required/>
                    <label htmlFor="password">Password</label>    
                        <input type="password" id="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} required/>
                    <button type="submit">Register</button>
                </form>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <p>If you have an account <Link to="/login">Log in</Link></p>
        </div>   
    );
};

