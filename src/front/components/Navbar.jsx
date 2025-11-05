import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rzBrand from "../assets/img/rz-brand.png";


export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const { isLogged, user } = store;
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const offcanvasRef = useRef(null); 

    const closeOffcanvas = () => {
        if (offcanvasRef.current && window.bootstrap) {
            const offcanvasInstance = window.bootstrap.Offcanvas.getInstance(offcanvasRef.current);
            if (offcanvasInstance) {
                offcanvasInstance.hide();
            }
        } else if (offcanvasRef.current) {
             offcanvasRef.current.querySelector('.btn-close')?.click();
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem('token');
        dispatch({
            type: "set_Logged",
            payload: false
        });
        closeOffcanvas();
        navigate("/");
    }

    const handleNavigation = (path) => {
        closeOffcanvas();
        navigate (path);
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container"> 
                <Link to="/" className="navbar-brand">
                    <img src={rzBrand} className="img-brand" alt="RutaZero Brand" />
                </Link>
                
                {isLogged ? (
                    <>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#offcanvasNavbar" 
                            aria-controls="offcanvasNavbar" 
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        
                        {user && (
                            <span className="text-black fw-bold me-3 d-none d-lg-block order-lg-last">
                                Hola {user.username || user.name || user.email}
                            </span>
                        )}

                       <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center d-flex flex-fill justify-content-lg-end"> 
                                
                                <li className="nav-item mx-2">
                                    <Link className={`nav-link ${isActive('/') ? 'active-nav-link' : ''}`} to="/">Inicio</Link>
                                </li>
                                <li className="nav-item mx-2">
                                    <Link className={`nav-link ${isActive('/profile') ? 'active-nav-link' : ''}`} to="/profile">Mi Perfil</Link>
                                </li>
                                <li className="nav-item mx-2">
                                    <Link className={`nav-link ${isActive('/rzelection') ? 'active-nav-link' : ''}`} to="/rzelection">Selecciona RutaZero</Link>
                                </li>
                                <li className="nav-item mx-2">
                                    <Link className={`nav-link ${isActive('/savedroutes') ? 'active-nav-link' : ''}`} to="/savedroutes">RutaZero Guardadas</Link>
                                </li>
                                <li className="nav-item ms-3">
                                    <button
                                        className="btn logout"
                                        onClick={handleLogOut}>
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        
                        <div 
                            className="offcanvas offcanvas-end d-lg-none" 
                            tabIndex="-1" 
                            id="offcanvasNavbar" 
                            aria-labelledby="offcanvasNavbarLabel"
                            ref={offcanvasRef}
                        >
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
                                <button  
                                    type="button"
                                    className="btn-close" 
                                    data-bs-dismiss="offcanvas" 
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="offcanvas-body">
                                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                    <li className="nav-item">
                                        <button className="nav-link active btn btn-link w-100 text-start" onClick={() => handleNavigation("/")}>Inicio</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link w-100 text-start" onClick={() => handleNavigation("/profile")}>Mi Perfil</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link w-100 text-start" onClick={() => handleNavigation("/rzelection")}>Selecciona RutaZero</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link w-100 text-start" onClick={() => handleNavigation("/savedroutes")}>RutasZero Guardadas</button>
                                    </li>
                                    <li className="nav-item mt-3">
                                        <button 
                                            className="btn logout w-100"
                                            onClick={handleLogOut}
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                ) : (
                    <Link to="/login">
                        <button className="btn login">Iniciar Sesión</button>
                    </Link>
                )}
            </div>
        </nav>
    );
};