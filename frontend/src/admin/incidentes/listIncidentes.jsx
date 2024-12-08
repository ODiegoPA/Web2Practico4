import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavAdminMenu from "../../components/AdminMenu";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

const ListIncidentes = () => {
    const [incidentes, setIncidentes] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedIncidente, setSelectedIncidente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markerArray, setMarkerArray] = useState([]);
    const [polylineArray, setPolylineArray] = useState([]);
    const map = useMap();

    useEffect(() => {
        getListaIncidentes();
        document.title = "Lista de Incidentes";
    }, []);

    useEffect(() => {
        if (!map || markerArray.length < 1) return;

        const incidentMarker = new window.google.maps.Marker({
            position: markerArray[0],
            map: map,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "#FF0000", // Rojo para indicar el accidente
                fillOpacity: 1,
                strokeColor: "#FF0000",
                strokeWeight: 1,
                scale: 8,
            },
        });

        // Dibujar la polyline si hay puntos
        if (polylineArray.length > 0) {
            const polyline = new window.google.maps.Polyline({
                path: polylineArray,
                geodesic: true,
                strokeColor: "#0000FF", // Azul para la carretera
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
            polyline.setMap(map);
        }

        return () => {
            incidentMarker.setMap(null);
        };
    }, [markerArray, polylineArray, map]);

    const getListaIncidentes = async () => {
        try {
            const res = await axios.get("http://localhost:3000/incidente");
            setIncidentes(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar los incidentes:", error);
            setLoading(false);
        }
    };

    const deleteIncidente = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:3000/incidente/${id}`);
            console.log("Incidente eliminado:", res.data);
            getListaIncidentes();
        } catch (error) {
            console.error("Error al eliminar el incidente:", error);
        }
    };

    const handleShowMap = (incidente) => {
        setSelectedIncidente(incidente);
        setShowMap(true);

        // Coordenadas del incidente
        const puntoIncidente = {
            lat: incidente.latitud,
            lng: incidente.longitud,
        };
        setMarkerArray([puntoIncidente]);

        // Obtener los puntos de la carretera
        const puntosCarretera = incidente.carretera.puntosCarretera.map(punto => ({
            lat: punto.latitud,
            lng: punto.longitud,
        }));
        setPolylineArray(puntosCarretera);
    };

    const handleCloseMap = () => {
        setShowMap(false);
        setMarkerArray([]);
        setPolylineArray([]);
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
                            <Card.Title className="text-center mt-3 mb-3">Lista de Incidentes</Card.Title>
                            {loading ? (
                                <p>Cargando incidentes...</p>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Imagen</th>
                                            <th>Tipo de Incidente</th>
                                            <th>Estado</th>
                                            <th>Carretera</th>
                                            <th>Ver en el Mapa</th>
                                            <th>Ultimo cambio</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incidentes.map((incidente) => (
                                            <tr key={incidente.id}>
                                                <td>
                                                    <img src={`http://localhost:3000/incidente/foto/${incidente.id}`} alt="Imagen del incidente" style={{ width: "100px" }} />
                                                </td>
                                                <td>{incidente.tipoIncidente.nombre}</td>
                                                <td>{incidente.estaConfirmada ? "Bloqueada" : "libre"}</td>
                                                <td>{incidente.carretera.nombre}</td>
                                                <td>
                                                    <Button variant="info" onClick={() => handleShowMap(incidente)}>Ver</Button>
                                                </td>
                                                <td>
                                                    {incidente.usuarioUltimoCambioIncidente?.nombre || "No hay información"}
                                                </td>
                                                <td>
                                                    <Link to={`/admin/incidente/edit/${incidente.id}`}>
                                                        <Button variant="warning">Editar</Button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => deleteIncidente(incidente.id)}>Eliminar</Button>
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
                    <Modal.Title>{selectedIncidente?.tipoIncidente.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map
                        mapId="bf51a910020fa25a"
                        style={{ width: "100%", height: "500px" }}
                        defaultCenter={defaultCenter}
                        defaultZoom={12}
                    >
                        {/* Mostrar el marcador del incidente */}
                        {selectedIncidente && (
                            <AdvancedMarker
                                position={{
                                    lat: selectedIncidente.latitud,
                                    lng: selectedIncidente.longitud,
                                }}
                                title="Lugar del Incidente"
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    fillColor: "#FF0000", // Marcador rojo
                                    fillOpacity: 1,
                                    strokeColor: "#FF0000",
                                    strokeWeight: 1,
                                    scale: 8,
                                }}
                            />
                        )}

                        {/* Mostrar los marcadores de los municipios */}
                        {selectedIncidente && selectedIncidente.origenMunicipio && selectedIncidente.destinoMunicipio && (
                            <>
                                {/* Marcador de origen */}
                                <AdvancedMarker
                                    position={{
                                        lat: selectedIncidente.carretera.municipioOrigen.latitud,
                                        lng: selectedIncidente.carretera.municipioOrigen.longitud,
                                    }}
                                    title={`Municipio de Origen: ${selectedIncidente.carretera.municipioOrigen.nombre}`}
                                    icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        fillColor: "#00FF00", // Verde para el origen
                                        fillOpacity: 1,
                                        strokeColor: "#00FF00",
                                        strokeWeight: 1,
                                        scale: 8,
                                    }}
                                />
                                {/* Marcador de destino */}
                                <AdvancedMarker
                                    position={{
                                        lat: selectedIncidente.carretera.municipioDestino.latitud,
                                        lng: selectedIncidente.carretera.municipioDestino.longitud,
                                    }}
                                    title={`Municipio de Destino: ${selectedIncidente.carretera.municipioDestino.nombre}`}
                                    icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        fillColor: "#0000FF", // Azul para el destino
                                        fillOpacity: 1,
                                        strokeColor: "#0000FF",
                                        strokeWeight: 1,
                                        scale: 8,
                                    }}
                                />
                            </>
                        )}
                    </Map>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMap}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ListIncidentes;
