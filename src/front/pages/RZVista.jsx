import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { getRouteById, saveRoute, unsaveRoute, isRouteSaved } from "../services/fetch.js";
import { getPlaceImageFromPexels } from "../services/api_img.js"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import rzPinMap from "../assets/img/rz-pin-map.png";

 
if (L && L.Icon) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

const customIcon = new L.Icon({
    iconUrl: rzPinMap, 
    iconSize: [18, 22], 
    iconAnchor: [17, 35], 
    popupAnchor: [0, -35] 
});

const selectedIcon = new L.Icon({
    iconUrl: rzPinMap, 
    iconSize: [48, 55], 
    iconAnchor: [22, 45],
    popupAnchor: [0, -45]
});

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center[0] !== 0 || center[1] !== 0) { 
            map.setView(center, zoom, { 
                animate: true, 
                duration: 0.8 
            });
        }
    }, [center, zoom, map]);
    return null;
};


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
    const [selectedPlace, setSelectedPlace] = useState(null);

    const [isSaved, setIsSaved] = useState(false);
    
    
    const allPlaces = useMemo(() => {
        return route?.places || [];
    }, [route]);
    
    const initialCenter = useMemo(() => {
        if (allPlaces.length > 0 && allPlaces[0].latitude && allPlaces[0].longitude) {
            return [allPlaces[0].latitude, allPlaces[0].longitude];
        }
        return null; 
    }, [allPlaces]);

    const mapCenter = useMemo(() => {
        if (selectedPlace && selectedPlace.latitude && selectedPlace.longitude) {
            return [selectedPlace.latitude, selectedPlace.longitude];
        }
        return initialCenter;
    }, [selectedPlace, initialCenter]);

    const handleSelectPlace = useCallback((place) => {
        setSelectedPlace(place);
    }, []);

    const navigate = useNavigate(); 
    
    const handleGoBack = () => {
        navigate(-1); 
    };

    const handleSaveRoute = async () => {
        if (!routeID_Int) return;

        try {
            if (isSaved) {
                // 💡 Lógica para DESGUARDAR (Unsave)
                await unsaveRoute(routeID_Int);
                setIsSaved(false);
                alert("Ruta quitada de tus favoritos. 💔");
            } else {
                // 💡 Lógica para GUARDAR (Save)
                await saveRoute(routeID_Int);
                setIsSaved(true);
                alert("Ruta guardada exitosamente. 🎉");
            }
        } catch (err) {
            console.error(`Error al ${isSaved ? 'desguardar' : 'guardar'} la ruta:`, err);
            alert(`Error de API: ${err.message}`);
        }
    };

    useEffect(() => {
        const fetchRouteData = async () => {
            if (!routeID_Int) return;

            setLoading(true);
            setError(null);

            try {
                // 1. Cargar los datos de la ruta
                const data = await getRouteById(routeID_Int);
                if (!data) {
                    setError("Ruta no encontrada.");
                    setLoading(false);
                    return;
                }
                
                // 2. 💡 Verificar el estado inicial de la ruta guardada
                // Esto previene el error 409 al intentar guardar algo que ya está guardado.
                const savedStatus = await isRouteSaved(routeID_Int);
                setIsSaved(savedStatus);
                
                // 3. Estructurar y establecer la ruta
                const placesToStructure = data.places || [];
                const structuredRoute = {
                    ...data,
                    days: structurePlacesByDay(placesToStructure) 
                };
                
                setRoute(structuredRoute);
                
                if (placesToStructure.length > 0) {
                    setSelectedPlace(placesToStructure[0]);
                }
                
                // 4. Cargar imágenes por día
                const days = structuredRoute.days;
                const imageMapPromises = Object.keys(days).map(async (dayName) => {
                    const places = days[dayName];
                    if (places.length > 0) {
                        const randomIndex = Math.floor(Math.random() * places.length);
                        const randomPlaceName = places[randomIndex].name;
                        // ¡Aquí se llama a la función que causaba el error ReferenceError!
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
                // Aquí capturas cualquier error, incluido el CORS o el 500 inicial en isRouteSaved
                setError(`Error al cargar los detalles de la ruta: ${err.message}`); 
            } finally {
                setLoading(false);
            }
        };

        fetchRouteData();
    }, [routeID_Int]);


    if (loading) return <p className="text-center mt-5">Cargando detalles de la ruta... 🗺️</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
    if (!route) return <p className="text-center mt-5">Ruta no encontrada. 😕</p>;

    const daysOrder = Object.keys(route.days).sort();
    const totalDays = daysOrder.length;
    
    const mapZoom = 15; 

    return (
        <div className="container mt-5">
            <div 
                    className="text-secondary-bg" 
                    onClick={handleGoBack}
                >
                    <p>&larr; Volver a selección de rutas</p>
                </div>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                
                <div className="text-right">
                    <h6 className="display-6 mb-0">
                        <img 
                            src={rzPinMap} 
                            style={{ 
                            width: '28px',          
                            height: '35px',
                            marginRight: '8px',     
                            }}
                        />
                        <span className="color-rz">RutaZero</span> Detallada: {route.name} </h6>
                    <p className="lead text-muted mb-0">Duración: {totalDays} día(s)</p>
                </div>
                <button
                    className={`btn ${isSaved ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={handleSaveRoute}
                    disabled={!routeID_Int} // Deshabilitar si no tenemos routeId
                >
                    <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i> 
                    {isSaved ? ' Ruta Guardada' : ' Guardar Ruta'}
                </button>
            </div>
            
            
            <hr />

            <div className="row">
                <div className="col-lg-6 col-md-12">
                    <div className="row">
                        {daysOrder.map((dayName) => {
                            const imageUrl = dayImages[dayName]; 
                            const headerStyle = {
                                height: '150px',
                                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none', 
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '5px 5px 0 0',
                                
                            };
                            
                            const headerClasses = `card-img-top d-flex align-items-end ${imageUrl ? 'bg-dark' : 'bg-primary'}`;
                            const textBackground = imageUrl ? 'rgba(0, 0, 0, 0.5)' : 'transparent';

                            return (
                                <div key={dayName} className="col-sm-12 mb-4">
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
                                                {dayName}
                                            </h5>
                                        </div>
                                        
                                        <ul className="list-group list-group-flush">
                                            {route.days[dayName].map((place, index) => {
                                                const isSelected = selectedPlace?.name === place.name;
                                                return (
                                                    <li 
                                                        key={index} 
                                                        className={`list-group-item d-flex justify-content-between align-items-start ${isSelected ? 'list-group-item-info shadow-sm' : ''}`}
                                                        style={{cursor: 'pointer'}}
                                                        onClick={() => handleSelectPlace(place)}
                                                    >
                                                        <div>
                                                            <span
                                                            className={`badge me-2 ${isSelected ? '' : 'bg-secondary'}`}
                                                            style={isSelected ? { backgroundColor: 'rgb(39, 127, 175)' } : {}}
                                                            >
                                                            {index + 1}
                                                            </span>
                                                            {place.name}
                                                        </div>
                                                        {isSelected && <span className="badge">Seleccionado</span>}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="col-lg-6 col-md-12 mb-4">
                    <div className="card shadow-lg p-3 sticky-top">
                        <div 
                            className="card-header text-white text-center rounded-top p-3"
                            style={{ backgroundColor: 'rgb(39, 127, 175)'}}
                        >
                            <h3 className="h5 mb-0">Ubicaciones en el Mapa</h3>
                        </div>
                        <div style={{ height: "500px", width: "100%", marginTop: '15px' }}>
                            <MapContainer 
                                center={mapCenter} 
                                zoom={mapZoom} 
                                key={`map-${initialCenter.join('-')}`}
                                style={{ height: "100%", width: "100%", borderRadius: '5px' }}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CartoDB</a>'
                                />
                                                                
                                <ChangeView center={mapCenter} zoom={mapZoom} />
                                {allPlaces.map((place, idx) => {
                                    const isSelected = selectedPlace?.name === place.name;
                                    
                                    if (!place.latitude || !place.longitude) return null;
                                    
                                    const position = [place.latitude, place.longitude];
                                    
                                    return (
                                        <Marker 
                                            key={`${place.name}-${idx}`} 
                                            position={position}
                                            icon={isSelected ? selectedIcon : customIcon}
                                            zIndexOffset={isSelected ? 1000 : 0}
                                        >
                                            <Popup>
                                                <div className={isSelected ? "text-primary font-weight-bold" : "font-weight-bold"}>
                                                    {place.name}
                                                </div>
                                                <small className="text-muted">Día: {place.day.replace('Day ', '')}</small>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                                
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-5">
                <p className="display-6">¡Disfruta tu <span className="color-rz">RutaZero</span>!</p>
            </div>
        </div>
    );
};