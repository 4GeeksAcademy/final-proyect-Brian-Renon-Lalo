import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rzBrand from "../assets/img/rz-brand.png";

export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();
	const { isLogged } = store;
	/*const [profile, setProfile] = useState(null);*/
	const navigate = useNavigate();

	/*useEffect ( () => {
		if(store.userProfile && store.userProfile.token) {
			setIsLogged(true);
			setProfile(store.userProfile);
		} else {
			setIsLogged(false);
			setProfile(null);
		}
	}, [store.isLogged]);*/

	const handleLogOut = () => {
		localStorage.removeItem('token');
		dispatch({
			type: "set_Logged",
			payload: false
		})
		navigate("/");
	}


	return (
		<nav className="navbar">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src={rzBrand} className="img-brand" />
					</span>
				</Link>
								
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