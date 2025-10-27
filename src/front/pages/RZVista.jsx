import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { getRouteById } from "../services/fetch.js"; 
import { getPlaceImageFromPexels } from "../services/api_img.js"


const structurePlacesByDay = (places) => {
    if (!places) return {};
    return places.reduce((acc, place) => {
        const day = place.day;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(place);
        return acc;
    }, {});
};

export const RZVista = () => {
    const { routeId } = useParams(); 
    const routeID_Int = parseInt(routeId); 
    
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dayImages, setDayImages] = useState({}); 

    useEffect(() => {
        const fetchRouteData = async () => {
            if (!routeID_Int) return;

            try {
                const data = await getRouteById(routeID_Int);
                const structuredRoute = {
                    ...data,
                    days: structurePlacesByDay(data.places) 
                };
                
                setRoute(structuredRoute);
                setLoading(false);
                
                const days = structuredRoute.days;
                const imageMapPromises = Object.keys(days).map(async (dayName) => {
                    const places = days[dayName];
                    if (places.length > 0) {
                        const randomIndex = Math.floor(Math.random() * places.length);
                        const randomPlaceName = places[randomIndex].name;
                        
                        const imageUrl = await getPlaceImageFromPexels(randomPlaceName);
                        
                        return { day: dayName, url: imageUrl };
                    }
                    return { day: dayName, url: null }; 
                });

                const imagesResults = await Promise.all(imageMapPromises);
                
                const newDayImages = imagesResults.reduce((acc, item) => {
                    acc[item.day] = item.url;
                    return acc;
                }, {});

                setDayImages(newDayImages);

            } catch (err) {
                console.error("Error al cargar la ruta o imágenes:", err);
                setError("Error al cargar los detalles de la ruta.");
                setLoading(false);
            }
        };

        fetchRouteData();
    }, [routeID_Int]);


    if (loading) return <p className="text-center mt-5">Cargando detalles de la ruta...</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
    if (!route) return <p className="text-center mt-5">Ruta no encontrada.</p>;

    const daysOrder = Object.keys(route.days).sort();
    const totalDays = daysOrder.length;

    return (
        <div className="container mt-5">
            <div className="mb-4">
                <h2>🗺️ Detalle de la Ruta: **{route.name}**</h2>
                <p className="lead text-muted">Duración: **{totalDays} día(s)**</p>
            </div>
            <hr />

            <div className="row">
                {daysOrder.map((dayName) => {
                    const imageUrl = dayImages[dayName]; 
                    
                    const headerStyle = {
                        height: '150px',
                        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none', 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '5px 5px 0 0'
                    };
                    
                    const headerClasses = `card-img-top d-flex align-items-end ${imageUrl ? 'bg-dark' : 'bg-primary'}`;
                    const textBackground = imageUrl ? 'rgba(0, 0, 0, 0.5)' : 'transparent'; // Oscurecer el texto solo si hay imagen

                    return (
                        <div key={dayName} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                            <div className="card shadow-sm h-100">
                                <div 
                                    className={headerClasses}
                                    style={headerStyle}
                                >
                                    <h5 className="p-2 w-100 text-white" 
                                        style={{ 
                                            backgroundColor: textBackground, 
                                            margin: 0 
                                        }}>
                                        **{dayName}**
                                    </h5>
                                </div>
                                
                                <ul className="list-group list-group-flush">
                                    {route.days[dayName].map((place, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div>
                                                <span className="badge bg-secondary me-2">{index + 1}</span>
                                                **{place.name}**
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-5">
                <p>¡Disfruta tu RutaZero!</p>
            </div>
        </div>
    );
};