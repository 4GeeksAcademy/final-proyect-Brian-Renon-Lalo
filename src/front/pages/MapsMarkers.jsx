import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const Home = () => {
  const [coords, setCoords] = useState([40.6892532, -74.0445482]);

  // Lista de puntos para la ruta:
  const routePoints = [
    [40.706, -74.009], // Wall Street
    [40.7128, -74.006], // World Trade Center
    [40.758, -73.9855], // Times Square
    [40.7614, -73.9776], // Central Park South
    [40.7812, -73.9665]  // Central Park North
  ];

  return (
    <div className="text-center mt-5">
      <h1>Ruta en el mapa 😎</h1>

      <div style={{ height: "400px", width: "600px", margin: "0 auto" }}>
        <MapContainer center={coords} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {routePoints.map((point, idx) => (
            <Marker key={idx} position={point}>
              <Popup>Punto {idx + 1}</Popup>
            </Marker>
          ))}
          
        </MapContainer>
      </div>
    </div>
  );
};