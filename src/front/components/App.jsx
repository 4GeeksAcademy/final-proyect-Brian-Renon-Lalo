import { useEffect, useState } from "react";
import React, { useState, useEffect } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";


const App = () => {
    //para saber si esta logueado
    const [IsAuthenticated, setIsAuthenticated] = useState(false);
    //para alternaner entre login y register
    const [isLoginView, setIsLoginView] = useState(true);

    //verificar si ya existe token al cargar la app
    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            setIsAuthenticated(true);
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        setIsLoginView(true);
    };
    if (setIsAuthenticated) {
        { handleLogout };
    }


}