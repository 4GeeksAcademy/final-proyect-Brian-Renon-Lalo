import React, { useEffect } from "react"
import rzPin from "../assets/img/rz-pin.png";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

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
		<div className="text-center mt-5">
			<div className="home-container">
			<h2 className="display-5">⌚Es hora de aprovechar tu tiempo⌚</h2>
			<h4 className="display-6"><span className="color-rz">RutaZero</span> proporciona una ruta óptima para</h4>
			<h4 className="display-6">no perderte los lugares más icónicos de cada ciudad</h4>
			</div>
			<p className="lead">
				<img src={rzPin} className="img-pin" />
			</p>
			<div className="home-container">
			<h4 className="display-6">¡ <span className="color-rz">RutaZero</span> está diseñada para aquellos viajes express,</h4>
			<h4 className="display-6">viajes de negocios o escalas entre viajes!</h4>
			</div>

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