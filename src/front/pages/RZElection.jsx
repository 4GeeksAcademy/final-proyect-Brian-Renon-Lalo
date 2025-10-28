import React, { useEffect, useState } from "react";
import { getCities, getRoutesByCityId } from "../services/fetch.js";
import { getCityImageFromPexels, getRuteImageFromPexels } from "../services/api_img.js"
import { useNavigate } from "react-router-dom"; 

 

export const RZElection = () => {
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [error, setError] = useState(null);
    
    const [cityImagesMap, setCityImagesMap] = useState({}); 

    const [routesByCity, setRoutesByCity] = useState({}); 
    const [activeCityId, setActiveCityId] = useState(null); 
    const [loadingRoutes, setLoadingRoutes] = useState(false);
    
    const [routeImagesMap, setRouteImagesMap] = useState({});
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCitiesAndImages = async () => {
            try {
                const cityData = await getCities();
                setCities(cityData);
                
                const imagePromises = cityData.map(async (city) => {
                    const imageUrl = await getCityImageFromPexels(city.name);
                    return { id: city.id, url: imageUrl };
                });
                
                const results = await Promise.all(imagePromises);
                
                const imageMap = results.reduce((acc, current) => {
                    acc[current.id] = current.url;
                    return acc;
                }, {});
                
                setCityImagesMap(imageMap);
                setLoadingCities(false);

            } catch (err) {
                console.error("Error al obtener ciudades o imágenes:", err);
                setError("Error al cargar las ciudades o imágenes.");
                setLoadingCities(false);
            }
        };

        fetchCitiesAndImages();
    }, []);


    const handleSelectCity = async (cityId) => {
        if (activeCityId === cityId) {
            setActiveCityId(null);
            return;
        }

        setActiveCityId(cityId); 
        
        if (!routesByCity[cityId]) {
            setLoadingRoutes(true);
            try {
                const data = await getRoutesByCityId(cityId);
                const fetchedRoutes = data.routes;

                const imagePromises = fetchedRoutes.map(async (route) => {
                    const imageUrl = await getRuteImageFromPexels(route.name); 
                    return { id: route.id, url: imageUrl };
                });
                
                const imageResults = await Promise.all(imagePromises);
                
                const newRouteImages = imageResults.reduce((acc, item) => {
                    acc[item.id] = item.url;
                    return acc;
                }, {});
                
                setRouteImagesMap(prev => ({ ...prev, ...newRouteImages }));
                
                setRoutesByCity(prev => ({ ...prev, [cityId]: fetchedRoutes }));
            } catch (err) {
                console.error(`Error al obtener rutas o imágenes para la ciudad ${cityId}:`, err);
            } finally {
                setLoadingRoutes(false);
            }
        }
    };
    
    const handleRouteSelection = (routeId) => {
        navigate(`/routes/${routeId}`); 
    };


    if (loadingCities) return <p className="text-center mt-5">Cargando ciudades...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <div className="container mt-5">
            <h2 className="display-4 text-center mb-4">Selecciona tu Ruta por Ciudad</h2>
            <hr />
            <div className="row justify-content-center">
                {cities.map((city) => (
                    <div key={city.id} className="col-lg-10 col-md-10 col-sm-12 mb-4">
                        
                        <div className="card shadow city-card mb-3">
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img 
                                        src={cityImagesMap[city.id] || PLACEHOLDER_IMAGE} 
                                        className="img-fluid rounded-start" 
                                        alt={`Imagen de ${city.name}`} 
                                        style={{ height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body d-flex flex-column justify-content-center h-100">
                                        <h3 className="card-title">{city.name}</h3>
                                        <p className="card-text text-muted">Continente: {city.continent}</p>
                                        
                                        <button 
                                            className="btn mt-2" 
                                            type="button" 
                                            onClick={() => handleSelectCity(city.id)}
                                            aria-expanded={activeCityId === city.id}
                                        >
                                            {activeCityId === city.id ? 'Ocultar Rutas' : 'Ver Rutas Disponibles'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {activeCityId === city.id && (
                            <div className="routes-accordion mt-3 p-3 border rounded bg-light">
                                <h5 className="mb-3">Rutas en {city.name}:</h5>
                                {loadingRoutes ? (
                                    <p>Cargando rutas...</p>
                                ) : (
                                    <div className="row">
                                        {routesByCity[city.id] && routesByCity[city.id].length > 0 ? (
                                            routesByCity[city.id].map((route) => {
                                                const routeImageUrl = routeImagesMap[route.id];
                                                return (
                                                    <div key={route.id} className="col-lg-4 col-md-6 mb-3">
                                                        <div className="card h-100 shadow-sm">
                                                            
                                                            {routeImageUrl && (
                                                                <img 
                                                                    src={routeImageUrl} 
                                                                    className="card-img-top" 
                                                                    alt={`Imagen de ${route.name}`} 
                                                                    style={{ height: '150px', objectFit: 'cover' }}
                                                                />
                                                            )}
                                                            
                                                            <div className="card-body">
                                                                <h6 className="card-subtitle mb-2">{route.name}</h6>
                                                                <button 
                                                                    className="btn btn-sm mt-2 w-100" 
                                                                    onClick={() => handleRouteSelection(route.id)}
                                                                >
                                                                    Seleccionar Ruta
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="col-12 text-muted">No hay rutas disponibles para esta ciudad.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};