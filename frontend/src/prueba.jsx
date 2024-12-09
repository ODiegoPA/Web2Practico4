import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";
import axios from "axios";
import NavMainMenu from "./components/MainMenu";
import NavAdminMenu from "./components/AdminMenu";

const MapaCarreteras = () => {
  // Recuperar usuario de localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const [carreteras, setCarreteras] = useState([]);

  const centro = {
    lat: -17.4214,
    lng: -63.2115,
  };

  const containerStyle = {
    width: "100%",
    height: "600px",
  };

  useEffect(() => {
    const fetchCarreteras = async () => {
      try {
        const response = await axios.get("http://localhost:3000/carretera");
        console.log("Carreteras cargadas:", response.data);
        setCarreteras(response.data);
      } catch (error) {
        console.error("Error al cargar las carreteras:", error);
      }
    };

    fetchCarreteras();
  }, []);

  return (
    <>
      {user ? <NavAdminMenu /> : <NavMainMenu />}
      <LoadScript googleMapsApiKey="AIzaSyC5j_NfH5CoSXxxZY7XaKyLaAV_G08zkb8">
        <GoogleMap mapContainerStyle={containerStyle} center={centro} zoom={10}>
          {carreteras.map((carretera) => (
            <React.Fragment key={carretera.id}>
              {/* Dibuja la carretera */}
              <Polyline
                path={carretera.puntosCarretera.map((punto) => ({
                  lat: punto.latitud,
                  lng: punto.longitud,
                }))}
                options={{
                  strokeColor: carretera.estaBloqueada ? "#FF0000" : "#00FF00",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
              {/* Marcador en el municipio de origen */}
              <Marker
                position={{
                  lat: carretera.municipioOrigen.latitud,
                  lng: carretera.municipioOrigen.longitud,
                }}
                label={carretera.municipioOrigen.nombre}
              />
              {/* Marcador en el municipio de destino */}
              <Marker
                position={{
                  lat: carretera.municipioDestino.latitud,
                  lng: carretera.municipioDestino.longitud,
                }}
                label={carretera.municipioDestino.nombre}
              />
            </React.Fragment>
          ))}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default MapaCarreteras;
