import React, { useState, useEffect, useCallback } from 'react';
import { getSavedRoutes, unsaveRoute } from '../services/fetch';
import { getRuteImageFromPexels } from "../services/api_img.js" 
import { useNavigate } from 'react-router-dom';

export const SavedRoutes = () => {
    const [savedRoutes, setSavedRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [routeImagesMap, setRouteImagesMap] = useState({}); 
    const navigate = useNavigate();

    const fetchSavedRoutes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const routesData = await getSavedRoutes();
            setSavedRoutes(routesData);

            const imagePromises = routesData.map(async (route, index) => {
                const cityName = route.city_name || 'travel'; 
                const imageUrl = await getRuteImageFromPexels(route.name, cityName, index);
                return { id: route.id, url: imageUrl };
            });
            
            const imageResults = await Promise.all(imagePromises);
            
            const newRouteImages = imageResults.reduce((acc, item) => {
                acc[item.id] = item.url;
                return acc;
            }, {});
            
            setRouteImagesMap(newRouteImages);

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

    const handleDeleteRoute = async (routeId, routeName) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar la ruta "${routeName}" de tus favoritos?`)) {
            return;
        }

        try {
            await unsaveRoute(routeId);
            setSavedRoutes(prev => prev.filter(route => route.id !== routeId));
            alert(`Ruta "${routeName}" eliminada con éxito. 👋`);
        } catch (err) {
            console.error("Error al eliminar la ruta:", err);
            alert(`Error al eliminar la ruta: ${err.message}`);
        }
    };

    const handleRouteClick = (routeId) => {
        navigate(`/routes/${routeId}`); 
    };

    if (loading) {
        return <div className="text-center p-4 mt-5">Cargando rutas guardadas y sus imágenes...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-5">{error}</div>;
    }

    if (savedRoutes.length === 0) {
        return (
            <div className="alert alert-info text-center mt-5">
                Aún no tienes rutas guardadas. ¡Explora y añade algunas! 🗺️
            </div>
        );
    }
    
    return (
        <div className="container mt-5">
            <h2 className="display-5 text-center mb-4 border-bottom pb-2">Tus <span className="color-rz">RutasZero</span> Guardadas</h2>
            
            <div className="row justify-content-center">
                {savedRoutes.map((route) => {
                    const routeImageUrl = routeImagesMap[route.id];
                    return (
                        <div key={route.id} className="col-lg-10 col-md-10 col-sm-12 mb-4">
                            <div className="card shadow h-100 saved-route-card">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img 
                                            src={routeImageUrl || "https://via.placeholder.com/300x200?text=Cargando+Imagen"} 
                                            className="img-fluid rounded-start" 
                                            alt={`Imagen de ${route.name}`} 
                                            style={{ height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body d-flex flex-column justify-content-center h-100">
                                            <h4 className="card-title">{route.name}</h4>
                                            <p className="card-text text-muted">
                                                Ciudad: {route.city_name || 'Desconocida'}
                                            </p>
                                            
                                            <div className="mt-auto d-flex gap-2">
                                                <button 
                                                    className="btn btn-sm flex-grow-1" 
                                                    onClick={() => handleRouteClick(route.id)}
                                                >
                                                    Ver Detalles
                                                </button>
                                                <button 
                                                    className="btn btn-sm"
                                                    style={{backgroundColor: 'rgb(161, 30, 30)'}} 
                                                    onClick={() => handleDeleteRoute(route.id, route.name)}
                                                    title="Eliminar de favoritos"
                                                >
                                                    <i className="fa-solid fa-trash"></i> Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};