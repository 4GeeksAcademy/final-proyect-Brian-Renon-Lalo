import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const Home = () => {
  const [coords, setCoords] = useState([40.71427, -74.00597]);  
  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const response = await fetch(
          "https://nominatim.openstreetmap.org/search?q=NewYork&format=json"
        );
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setCoords([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (error) {
        console.error("Fallo buscando el mapa", error);
      }
    };

    fetchCoords();
  }, []);

  return (
    <div className="text-center mt-5">
      <h1>Mapa ......😎</h1>
      <div style={{ height: "400px", width: "600px", margin: "0 auto" }}>
        <MapContainer center={coords} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={coords}>
            <Popup>Aquí quiero ir 😎</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};