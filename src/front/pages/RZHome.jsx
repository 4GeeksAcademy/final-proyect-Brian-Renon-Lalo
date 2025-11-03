import React, { useEffect } from "react"
import rzHome from "../assets/img/rz-home.png";
import vistadiaruta from "../assets/img/vistadiaruta.jpg";
import vistaruta from "../assets/img/vistaruta.jpg";
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
			<div id="carouselExampleIndicators" className="carousel slide mb-5 mx-auto" data-bs-ride="carousel" style={{ maxWidth: '800px' }}>

				<div className="carousel-indicators">
					<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
					<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
					<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
				</div>

				{/* Contenido del Carrusel (las imágenes) */}
				<div className="carousel-inner">
					<div className="carousel-item active">
						<img src={rzHome} className="d-block w-100 img-fluid" alt="RutaZero Logo" />
					</div>
					<div className="carousel-item">
						{/* Uso de la imagen Captura.jpg */}
						<img src={vistaruta} className="d-block w-100 img-fluid" alt="Vista Previa Rutas New York" />
					</div>
					<div className="carousel-item">
						{/* Uso de la imagen Captura2.jpg */}
						<img src={vistadiaruta} className="d-block w-100 img-fluid" alt="Vista Previa Mapa New York" />
					</div>
				</div>


				<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
					<span className="carousel-control-prev-icon" aria-hidden="true" 
					style={{ backgroundColor: 'rgba(224, 142, 10, 0.527)', borderRadius: '50%' }}></span>
					<span className="visually-hidden">Anterior</span>
				</button>
				<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
					<span className="carousel-control-next-icon" aria-hidden="true"
					style={{ backgroundColor: 'rgba(224, 142, 10, 0.527)', borderRadius: '50%' }}></span>
					<span className="visually-hidden">Siguiente</span>
				</button>
			</div>



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