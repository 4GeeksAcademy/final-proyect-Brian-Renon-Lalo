import rzBrand from "../assets/img/rz-brand.png";

export const Footer = () => (
	<footer className="footer py-4 mt-5">
		<div className="container">
			<div className="row position-relative text-center text-md-start align-items-center">
				<div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start mb-3">
					<div className="d-flex align-items-center gap-2 mb-2">
						<span className="rz-dot"></span>
						<strong className="rz-brand">RutaZero</strong>
						<span className="rz-beta">BETA</span>
					</div>

					<p className="mb-1 fw-semibold">
						Esta es una versión beta del proyecto <span className="brand-name">RutaZero</span>.
					</p>
				</div>
				<div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-end mb-3">
					<p className="mb-1">
						Creado por <strong>Brian, Lalo y Rennon</strong>.
					</p>
					<p className="mb-2 slogan">
						Explorando ciudades. Diseñando experiencias.
					</p>
				</div>
				<div className="position-absolute w-100 d-flex justify-content-center" style={{top: "50%", transform: "translateY(-40%)"}}>
					<img src={rzBrand} className="img-footer" />
				</div>

			</div>
			<div className="text-center mt-4">
				<p className="small copyright m-0">
					© {new Date().getFullYear()} RutaZero • Todos los derechos reservados
				</p>
			</div>
		</div>
	</footer>
);
