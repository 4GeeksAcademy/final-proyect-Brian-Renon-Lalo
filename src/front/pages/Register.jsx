import React, { useState } from "react";
import { register } from "../../services/fetch";
import { Link, useNavigate } from "react-router-dom";


const Register=() => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        try {
            const data = await register (email, password);
            setSuccess("Login Success!");
            navigate("/login");
        }
        catch (err) {
            setError("Error to register");
        }
    };
    

    return (
        <div className="container-register">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit">Create new account</button>
            </form>
                {success && <p className="succes">{success}</p>}
                {error && <p className="error">{error}</p>}
            <p>Do you have an account?<Link to="/Register">Register</Link></p>
        </div>
    );
};

export default Register;