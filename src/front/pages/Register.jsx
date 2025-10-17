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
        <div className="register-container">
            <h2>Register</h2>
            <div className="register-form-container">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name">Name</label>
                        <input className="form-control" type="text" id="name" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input className="form-control" type="email" id="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">Password</label>    
                        <input className="form-control" type="password" id="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <button className="btn" type="submit">Register</button>
                </form>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <p>If you have an account <Link to="/login">Login</Link></p>
            </div>    
        </div>   
    );
};

