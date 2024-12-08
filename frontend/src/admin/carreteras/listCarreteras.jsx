import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavAdminMenu from "../../components/AdminMenu";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

const ListCarreteras = () => {
    const [carreteras, setCarreteras] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedCarretera, setSelectedCarretera] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markerArray, setMarkerArray] = useState([]);
    const map = useMap();

    useEffect(() => {
        getListCarreteras();
        document.title = "Lista de Carreteras";
    }, []);

    useEffect(() => {
        if (!map || markerArray.length < 2) return;

        const flightPath = new window.google.maps.Polyline({
            path: markerArray,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        flightPath.setMap(map);

        return () => {
            flightPath.setMap(null);
        };
    }, [markerArray, map]);

    const getListCarreteras = async () => {
        try {
            const res = await axios.get("http://localhost:3000/carretera");
            setCarreteras(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar las carreteras:", error);
            setLoading(false);
        }
    };

    const deleteCarretera = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:3000/carretera/${id}`);
            console.log("Carretera eliminada:", res.data);
            getListCarreteras();
        } catch (error) {
            console.error("Error al eliminar la carretera:", error);
        }
    };

    const handleShowMap = (carretera) => {
        setSelectedCarretera(carretera);
        setShowMap(true);

        const puntos = carretera.puntosCarretera.map((punto) => ({
            lat: punto.latitud,
            lng: punto.longitud,
        }));
        setMarkerArray(puntos);
    };

    const handleCloseMap = () => {
        setShowMap(false);
        setMarkerArray([]);
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
                            <Card.Title className="text-center mt-3 mb-3">Lista de Carreteras</Card.Title>
                            {loading ? (
                                <p>Cargando carreteras...</p>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Municipio Origen</th>
                                            <th>Municipio Destino</th>
                                            <th>Está Bloqueada?</th>
                                            <th>Último Cambio</th>
                                            <th>Ver en Mapa</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {carreteras.map((carretera) => (
                                            <tr key={carretera.id}>
                                                <td>{carretera.nombre}</td>
                                                <td>{carretera.municipioOrigen.nombre}</td>
                                                <td>{carretera.municipioDestino.nombre}</td>
                                                <td>{carretera.estaBloqueada ? "Sí" : "No"}</td>
                                                <td>{carretera.usuarioUltimoCambioCarretera.nombre}</td>
                                                <td>
                                                    <Button variant="info" onClick={() => handleShowMap(carretera)}>Ver</Button>
                                                </td>
                                                <td>
                                                    <Link to={`/admin/carretera/formulario/${carretera.id}`} className="btn btn-warning">Editar</Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => deleteCarretera(carretera.id)}>Eliminar</Button>
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
                    <Modal.Title>{selectedCarretera?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map
                        mapId="bf51a910020fa25a"
                        style={{ width: "100%", height: "500px" }}
                        defaultCenter={defaultCenter}
                        defaultZoom={6}
                    >
                        {/* Marcadores de municipios */}
                        {selectedCarretera?.municipioOrigen && (
                                <AdvancedMarker
                                    position={{
                                        lat: selectedCarretera.municipioOrigen.latitud,
                                        lng: selectedCarretera.municipioOrigen.longitud,
                                    }}
                                    title="Origen"
                                />
                            )}
                            {selectedCarretera?.municipioDestino && (
                                <AdvancedMarker
                                    position={{
                                        lat: selectedCarretera.municipioDestino.latitud,
                                        lng: selectedCarretera.municipioDestino.longitud,
                                    }}
                                    title="Destino"
                                />
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

export default ListCarreteras;
