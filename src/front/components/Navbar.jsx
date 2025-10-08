import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {

	const [isLogged, setIsLogged] = useState(false);
	const { store, dispatch } = useGlobalReducer();
	const [perfil, setPerfil] = useState (null);
	const navigate = useNavigate();

	useEffect(() => {
		if (store.perfilUsuario || store.perfilUsuario.token) {
			setIsLogged(true);
			setPerfil(store.perfilUsuario);
		} else {
			setIsLogged(false);
			setPerfil(null);
		}
			
		}, [store.perfilUsuario]);

		const handleLogOut = () => {
			localStorage.removeItem("token");
			setIsLogged(false);
			navigate("/");
		}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Rute Zero</span>
				</Link>
				<div className="ml-auto">
					{isLogged ? ( 
						<button className="btn btn-danger" onClick={handleLogOut}>LogOut</button>
					) : (
					<Link to="/login">
						<button className="btn btn-primary">LogIn</button>
					</Link>
					)}
				</div>
			</div>
		</nav>
	);
};