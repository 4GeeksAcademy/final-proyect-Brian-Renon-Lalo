import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rzBrand from "../assets/img/rz-brand.png";


export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const { isLogged, user } = store;
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('token');
        dispatch({
            type: "set_Logged",
            payload: false
        })
        navigate("/");
    }

    const handleNavigation = (path) => {
        navigate (path);

    }

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">
                        <img src={rzBrand} className="img-brand" />
                    </span>
                </Link>
                               
                <div className="ml-auto d-flex align-items-center">
                   {isLogged ? (
                    <>
                        {user && (
                            <span className="text-black fw-bold me-3 d-none">
                                Hola {user.username || user.name || user.email}
                            </span>
                        )}


                        <div className="d-none d-lg-flex align-items-center">
                                <ul className="nav nav-tabs flex-row align-items-center">
                                    <li className="nav-item mx-3">
                                        <button
                                            className="nav-link btn btn-link" 
                                            onClick={() => handleNavigation("/")}>
                                            Inicio
                                        </button>
                                    </li>
                                    <li className="nav-item mx-3">
                                        <button 
                                            className="nav-link btn btn-link" 
                                            onClick={() => handleNavigation("/profile")}>
                                            Mi Perfil
                                        </button>
                                    </li>
                                    <li className="nav-item mx-3">
                                        <button 
                                            className="nav-link btn btn-link" 
                                            onClick={() => handleNavigation("/rzelection")}>
                                            Selecciona tu RutaZero
                                        </button>
                                    </li>
                                    <li className="nav-item mx-3">
                                        <button 
                                            className="nav-link btn btn-link" 
                                            onClick={() => handleNavigation("/savedroutes")}>
                                            RutasZero Guardadas
                                        </button>
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

                            {/*Vista dispositivos md/sm */}
                            <button 
                                className="navbar-toggler d-lg-none" 
                                type="button" 
                                data-bs-toggle="offcanvas" 
                                data-bs-target="#offcanvasNavbar" 
                                aria-controls="offcanvasNavbar" 
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div 
                                className="offcanvas offcanvas-end" 
                                tabIndex="-1" 
                                id="offcanvasNavbar" 
                                aria-labelledby="offcanvasNavbarLabel"
                            >
                                <div className="offcanvas-header">
                                    <h5 >Menú</h5>
                                    <button  
                                        className="btn-close" 
                                        data-bs-dismiss="offcanvas" 
                                        aria-label="Close"
                                    ></button>
                                </div>

                                <div className="offcanvas-body">
                                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                        <li className="nav-item">
                                            <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/profile">Mi Perfil</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/rzelection">Selecciona RutaZero</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/savedroutes">RutasZero Guardadas</Link>
                                        </li>
                                        <li className="nav-item">
                                            <button 
                                                className="btn logout w-100 mt-2"
                                                onClick={handleLogOut}
                                            >
                                                LogOut
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Link to="/login">
                            <button className="btn login">Login</button>
                        </Link>
                        )}
                </div>
            </div>
        </nav>
    );
};