import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
// Importaciones de servicios (manteniendo las tuyas)
import { getRouteById } from "../services/fetch.js"; 
import { getPlaceImageFromPexels } from "../services/api_img.js";

// Importaciones de React-Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Necesario para que los marcadores predeterminados de Leaflet funcionen correctamente
import L from 'leaflet';
import rzPinMap from "../assets/img/rz-pin-map.png";

 
// Fix para el icono de Leaflet (para que se muestre correctamente en entornos React)
if (L && L.Icon) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

// 📌 1. Definición del icono personalizado de RutaZero
const customIcon = new L.Icon({
    iconUrl: rzPinMap, // Usa la imagen importada
    iconSize: [18, 25], // Tamaño del ícono [ancho, alto]
    iconAnchor: [17, 35], // Punto donde la punta del pin debe estar en la coordenada
    popupAnchor: [0, -35] // Punto donde se abrirá el popup en relación al icono
});

// 📌 2. Definición de un icono "Seleccionado" (opcional, para resaltarlo)
const selectedIcon = new L.Icon({
    iconUrl: rzPinMap, // Mismo pin
    iconSize: [48, 55], // Un poco más grande para destacarlo
    iconAnchor: [22, 45],
    popupAnchor: [0, -45]
});

// Componente auxiliar para controlar el cambio de vista del mapa
// Se activa cuando el usuario selecciona un lugar de la lista
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center[0] !== 0 || center[1] !== 0) { // Evita moverse a [0, 0]
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
    // Nuevo estado para rastrear el lugar seleccionado (para el mapa)
    const [selectedPlace, setSelectedPlace] = useState(null);
    
    // --- Lógica para el mapa ---
    
    // 1. Extraer todos los lugares de la ruta
    const allPlaces = useMemo(() => {
        return route?.places || [];
    }, [route]);
    
    // 2. Calcular el centro inicial del mapa (coordenadas del primer lugar)
    const initialCenter = useMemo(() => {
        // Asumiendo que route.places[0] contiene las propiedades 'latitude' y 'longitude'
        if (allPlaces.length > 0 && allPlaces[0].latitude && allPlaces[0].longitude) {
            return [allPlaces[0].latitude, allPlaces[0].longitude];
        }
        // Centro de respaldo si no hay lugares (ej. Estatua de la Libertad, NYC)
        return null; 
    }, [allPlaces]);

    // 3. Coordenadas del lugar seleccionado (para mover el mapa)
    const mapCenter = useMemo(() => {
        if (selectedPlace && selectedPlace.latitude && selectedPlace.longitude) {
            return [selectedPlace.latitude, selectedPlace.longitude];
        }
        // Si no hay lugar seleccionado, se mantiene el centro inicial (o el de respaldo)
        return initialCenter;
    }, [selectedPlace, initialCenter]);

    // 4. Función para manejar el clic en un lugar de la lista
    const handleSelectPlace = useCallback((place) => {
        setSelectedPlace(place);
    }, []);
    // 1. Inicializar useNavigate
    const navigate = useNavigate(); 
    
    // 2. 🚨 Mover handleGoBack DENTRO del componente para que acceda a 'navigate'
    const handleGoBack = () => {
        navigate(-1); 
    };

    // --- Lógica de Carga de Datos y Imágenes ---
    useEffect(() => {
        const fetchRouteData = async () => {
            if (!routeID_Int) return;

            try {
                const data = await getRouteById(routeID_Int);
                if (!data) {
                    setError("Ruta no encontrada.");
                    setLoading(false);
                    return;
                }
                
                // Asumo que 'data' incluye una propiedad 'places' con lat/lng
                const placesToStructure = data.places || [];
                const structuredRoute = {
                    ...data,
                    days: structurePlacesByDay(placesToStructure) 
                };
                
                setRoute(structuredRoute);
                
                // Establecer el primer lugar como seleccionado al cargar para que el mapa se centre
                if (placesToStructure.length > 0) {
                    setSelectedPlace(placesToStructure[0]);
                }
                
                // Obtener imágenes para cada día
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
            } finally {
                setLoading(false);
            }
        };

        fetchRouteData();
    }, [routeID_Int]);


    // --- Renderizado de mensajes de estado ---
    if (loading) return <p className="text-center mt-5">Cargando detalles de la ruta... 🗺️</p>;
    if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
    if (!route) return <p className="text-center mt-5">Ruta no encontrada. 😕</p>;

    // --- Preparación de datos para el renderizado ---
    const daysOrder = Object.keys(route.days).sort();
    const totalDays = daysOrder.length;
    
    // Zoom fijo para la vista de lugar
    const mapZoom = 15; 

return (
        <div className="container mt-5">
            {/* ⬅️ Enlace "Volver Atrás" y Título */}
            <div 
                    className="text-primary" 
                    onClick={handleGoBack}
                >
                    &larr; Volver atrás
                </div>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                
                <div className="text-right">
                    <h2 className="mb-0">🗺️ Detalle de la Ruta: **{route.name}**</h2>
                    <p className="lead text-muted mb-0">Duración: **{totalDays} día(s)**</p>
                </div>
            </div>
            
            <hr />

            <div className="row">
                
                {/* ⬅️ COLUMNA IZQUIERDA: Contenido (Itinerario) */}
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
                                                **{dayName}**
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
                                                            <span className={`badge me-2 ${isSelected ? 'bg-primary' : 'bg-secondary'}`}>{index + 1}</span>
                                                            **{place.name}**
                                                        </div>
                                                        {isSelected && <span className="badge bg-success">Seleccionado</span>}
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

                {/* ➡️ COLUMNA DERECHA: Mapa */}
                <div className="col-lg-6 col-md-12 mb-4">
                    <div className="card shadow-lg h-100 p-3">
                        <div className="card-header bg-primary text-white text-center rounded-top p-3">
                            <h3 className="h5 mb-0">Ubicaciones en el Mapa 📍</h3>
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

                                {/* Marcadores de Todos los Lugares */}
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
                <p>¡Disfruta tu RutaZero!</p>
            </div>
        </div>
    );
};