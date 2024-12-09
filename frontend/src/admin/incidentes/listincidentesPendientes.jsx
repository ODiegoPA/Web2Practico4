import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Modal } from "react-bootstrap";
//import { Link } from "react-router-dom";
import NavAdminMenu from "../../components/AdminMenu";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

const ListIncidentesPendientes = () => {
    const navigate = useNavigate();
    const [incidentes, setIncidentes] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedIncidente, setSelectedIncidente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [polylineArray, setPolylineArray] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
        getListaIncidentes();
        document.title = "Incidentes Pendientes";
    }, []);

    useEffect(() => {
        if (!map || polylineArray.length === 0) return;

        // Crear la polilínea
        const polyline = new window.google.maps.Polyline({
            path: polylineArray,
            geodesic: true,
            strokeColor: "#0000FF",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        polyline.setMap(map);

        return () => {
            polyline.setMap(null);
        };
    }, [polylineArray, map]);

    useEffect(() => {
        if (!map || !selectedPosition) return;

        // Dibujar el marcador en la posición seleccionada
        const marker = new window.google.maps.Marker({
            position: selectedPosition,
            map: map,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "#FF0000",
                fillOpacity: 1,
                strokeColor: "#FF0000",
                strokeWeight: 1,
                scale: 8,
            },
        });

        return () => {
            marker.setMap(null);
        };
    }, [selectedPosition, map]);

    const getListaIncidentes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/incidente/pendientes");
            setIncidentes(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar los incidentes:", error);
        }
    };

    const eliminarIncidente = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este incidente?")) return;

        try {
            await axios.delete(`http://localhost:3000/incidente/${id}`);
            getListaIncidentes();
            alert("Incidente eliminado exitosamente.");
        } catch (error) {
            console.error("Error al eliminar el incidente:", error);
            alert("Error al eliminar el incidente. Inténtalo de nuevo.");
        }
    };

    const handleShowMap = (incidente) => {
        setSelectedIncidente(incidente);
        setShowMap(true);

        const { municipioOrigen, municipioDestino } = incidente.carretera || {};
        if (municipioOrigen && municipioDestino) {
            setPolylineArray([
                { lat: municipioOrigen.latitud, lng: municipioOrigen.longitud },
                { lat: municipioDestino.latitud, lng: municipioDestino.longitud },
            ]);
        }
    };

    const handleCloseMap = () => {
        setShowMap(false);
        setPolylineArray([]);
        setSelectedPosition(null);
    };

    const handleMapClick = (event) => {
        // Acceder a las coordenadas desde event.detail.latLng
        if (event.detail && event.detail.latLng) {
            setSelectedPosition({
                lat: event.detail.latLng.lat,
                lng: event.detail.latLng.lng,
            });
        } else {
            console.error("No se pudo obtener la posición del clic en el mapa:", event);
        }
    };
    
    

    const confirmarUbicacion = async () => {
        if (!selectedPosition || !selectedIncidente) {
            alert("Por favor selecciona una ubicación en el mapa.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("estaConfirmada", true);
            formData.append("latitud", selectedPosition.lat);
            formData.append("longitud", selectedPosition.lng);
            formData.append("ultimoCambioId", JSON.parse(localStorage.getItem("user")).id);

            await axios.put(`http://localhost:3000/incidente/confirmar/${selectedIncidente.id}`, formData);
            await axios.put(`http://localhost:3000/carretera/verificar/${selectedIncidente.idCarretera}`);
            getListaIncidentes();
            alert("Ubicación confirmada exitosamente.");
            navigate("/admin/incidentes");
        } catch (error) {
            console.error("Error al confirmar la ubicación:", error);
            alert("Error al confirmar la ubicación. Inténtalo de nuevo.");
        }

        handleCloseMap();
    };

    const defaultCenter = {
        lat: -17.4214,
        lng: -63.2115,
    };

    return (
        <>
            <NavAdminMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card.Body>
                            <Card.Title className="text-center mt-3 mb-3">Incidentes Pendientes</Card.Title>
                            {loading ? (
                                <p>Cargando incidentes...</p>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Imagen</th>
                                            <th>Carretera</th>
                                            <th>Descripción</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incidentes.map((incidente) => (
                                            <tr key={incidente.id}>
                                                <td>
                                                    <img
                                                        src={`http://localhost:3000/incidente/foto/${incidente.id}`}
                                                        alt="Imagen del incidente"
                                                        style={{ width: "100px" }}
                                                    />
                                                </td>
                                                <td>{incidente.carretera?.nombre || "No disponible"}</td>
                                                <td>{incidente.tipoIncidente?.nombre || "Sin descripción"}</td>
                                                <td>
                                                    <Button variant="info" onClick={() => handleShowMap(incidente)}>
                                                        Confirmar
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => eliminarIncidente(incidente.id)}>
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Col>
                </Row>
            </Container>

            <Modal show={showMap} onHide={handleCloseMap} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Ubicación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Map
                    mapId="bf51a910020fa25a"
                    style={{ width: "100%", height: "500px" }}
                    defaultCenter={defaultCenter}
                    defaultZoom={12}
                    onClick={handleMapClick}
                >
                    {selectedPosition && (
                        <AdvancedMarker
                            position={selectedPosition}
                            title="Ubicación Seleccionada"
                            icon={{
                                path: window.google.maps.SymbolPath.CIRCLE,
                                fillColor: "#FF0000",
                                fillOpacity: 1,
                                strokeColor: "#FF0000",
                                strokeWeight: 1,
                                scale: 8,
                            }}
                        />
                    )}
                </Map>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMap}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={confirmarUbicacion}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ListIncidentesPendientes;
