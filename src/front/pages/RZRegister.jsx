import { useState } from "react";
import { register } from "./../services/fetch";
import { Link, useNavigate } from "react-router-dom";




export const RZRegister = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState ("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState ("");
    const [success, setSuccess] = useState (""); 
    const navigate = useNavigate();
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@@#$%^&*])(?=.{8,})/;


const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!passwordRegex.test(password)) {
            alert("⚠️La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un símbolo especial (!@#$%^&*).⚠️");
            return; 
        }

        try{
            const data = await register(name, email, password);
            setSuccess("Register completed successfully ✅");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError("Error trying to register❌"); 
        }
    };


    return (
        <div className="register-container d-flex flex-column align-items-center justify-content-center p-4">
            <h2>Nueva Cuenta</h2>
            <div className="register-form-container">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name">Nombre</label>
                        <input className="form-control" type="text" id="name" value={name} placeholder="Nombre" onChange={(e) => setName(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input className="form-control" type="email" id="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">Contraseña</label>    
                        <input className="form-control" type="password" id="password" value={password} placeholder="Ejemploo!" onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <button className="btn" type="submit">Registrar</button>
                </form>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <p>Si ya dispones de una cuenta, <Link to="/login">Iniciar Sesión</Link></p>
            </div>    
        </div>   
    );
};

