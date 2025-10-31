import React, { useEffect } from "react"
import rzHome from "../assets/img/rz-home.png";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom"; 

export const RZHome = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center justify-content-center aling-items-center mt-5">
			
				<img src={rzHome} className="img-logo" />
			
			<div className="info-container">
			<h3 className="display-1">Optimiza tu tiempo</h3>
			<h3 className="display-1">en cada ciudad</h3>
			<p className="display-6"><span className="color-rz">RutaZero</span> te proporciona la mejor ruta para aprovechar</p>
			<p className="display-6">al máximo tus horas sin perder lugares clave</p>
			</div>
			
			<div className="home-container">
			<h4 className="display-6">¡Entra en <Link to="/login" className="home-login"><span className="color-rz">RutaZero</span></Link>!</h4>
			</div>
			<p className="display-6">Hecho para viajeros rápidos, curiosos y estratégicos.</p>

			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
		</div>
	);
}; 