import React, { useState } from 'react';
import { login } from '../../services/fetch';
import Register from './Register';

const Login = ({ switchToRegister, setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [succes, setSuccess] = useState('');
    const navigate = useNavigate('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");


        try {
            const data = await login(email, password);
            setSuccess("Login succesfully");
            console.log("User logged in:", data)

            setTimeout(() => {
                navigate("/")//añadir componente perfil
            }, 1000);

        } catch (err) {
            setError("Incorrect LogIn");
        }
    };

    return (
        <div className="container-login">
            <form onSubmit={handleSubmit}>
                <h2>Log In</h2>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Enter</button>
            </form>
                {error && <p className='error'>{error}</p>}
                {succes && <p className='success'>{succes}</p>}
            <p>Have an account yet?  <Link to="/register">Log In</Link></p>
        </div>    
        );
    };

export default Login;