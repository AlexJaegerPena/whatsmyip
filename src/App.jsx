import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue with Leaflet and React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const App = () => {
  const [ipData, setIpData] = useState(null);

  useEffect(() => {
    const fetchIpData = async () => {
      try {
        const response = await axios.get(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_uujw6kNcXfF2qhCdYl2CefBy8vPzV&ipAddress=5.146.166.204`,
          {
            params: {
              apiKey: import.meta.env.VITE_GEOIPIFY_API_KEY,
            },
          }
        );
        setIpData(response.data);
      } catch (error) {
        console.error("Error fetching the IP data", error);
      }
    };

    fetchIpData();
  }, []);

  if (!ipData) {
    return <div>Loading map...</div>;
  }

  const { location } = ipData;
  const position = [location.lat, location.lng];

  return (
    <div
      className="position-map"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "65vh",
      }}
    >
      <div style={{ height: "65vh", width: "80%" }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              {ipData.ip} <br /> {location.city}, {location.country}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
