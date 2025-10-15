import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rzBrand from "../assets/img/rz-brand.png";

export const Navbar = () => {

	const [isLogged, setIsLogged] = useState(false);
	const { store, dispatch } = useGlobalReducer();
	const [profile, setProfile] = useState(null);
	const navigate = useNavigate();

	useEffect ( () => {
		if(store.userProfile && store.userProfile.token) {
			setIsLogged(true);
			setProfile(store.userProfile);
		} else {
			setIsLogged(false);
			setProfile(null);
		}
	}, [store.userProfile]);

	const handleLogOut = () => {
		localStorage.removeItem('token');
		setIsLogged(false);
		navigate("/");
	}


	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				{isLogged ? (
					<Link to="/profile">
					<span className="navbar-brand mb-0 h1">
						<img src={rzBrand} className="img-brand" />
					</span>
				</Link>
				) : (
					<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src={rzBrand} className="img-brand" />
					</span>
				</Link>
				)}				
				<div className="ml-auto">
					{isLogged ? (
						<button className="btn btn-danger" onClick={handleLogOut}>LogOut</button>
					) : (
						<Link to="/login">
							<button className="btn btn-primary">Login</button>
						</Link>
						)}
				</div>
			</div>
		</nav>
	);
};