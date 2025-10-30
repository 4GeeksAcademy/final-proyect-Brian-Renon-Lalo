import React, { useState, useEffect, useCallback } from 'react';
import { getSavedRoutes } from '../services/fetch'; // Ajusta la ruta a tu archivo fetch.js
import { useNavigate } from 'react-router-dom';

export const SavedRoutes = () => {
    const [savedRoutes, setSavedRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchSavedRoutes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Llama a la función de fetch que has definido
            const routesData = await getSavedRoutes();
            setSavedRoutes(routesData);
        } catch (err) {
            console.error("Error loading saved routes:", err);
            setError("Error al cargar tus rutas guardadas. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSavedRoutes();
    }, [fetchSavedRoutes]);

    if (loading) {
        return <div className="text-center p-4">Cargando rutas guardadas...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>;
    }

    if (savedRoutes.length === 0) {
        return (
            <div className="alert alert-info text-center">
                Aún no tienes rutas guardadas. ¡Explora y añade algunas!
            </div>
        );
    }
    
    const handleRouteClick = (routeId) => {
        navigate(`/routes/${routeId}`); 
    };

    return (
        <div className="mt-4">
            <h4 className="border-bottom pb-2 mb-3">Tus Rutas Guardadas ({savedRoutes.length})</h4>
            {savedRoutes.length === 0 ? (
                <div className='"alert alert-warning text center'>
                    Aún no tienes rutas guardadas. ¡Explora las opciones para guardar!
                </div>
            ) : (
            <div className="list-group">
                {savedRoutes.map((route, index) => (
                    <button 
                        key={index}
                        type="button" 
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        onClick={() => handleRouteClick(route.id)}
                    >
                        <span className="fw-bold">{route.name}</span>
                        <span className="badge bg-secondary rounded-pill">ID: {route.id}</span>
                    </button>
                ))}
            </div>
            )}
        </div>
    );
};