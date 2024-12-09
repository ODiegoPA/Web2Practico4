import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Modal, Form } from "react-bootstrap";
import { Map, useMap } from "@vis.gl/react-google-maps";
import NavMainMenu from "./components/MainMenu";

const MainPage = () => {
    const [carreteras, setCarreteras] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [selectedCarretera, setSelectedCarretera] = useState(null);
    const [selectedType, setSelectedType] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [incidentImage, setIncidentImage] = useState(null);
    const [mapCenter] = useState({ lat: -16.2902, lng: -63.5887 });
    const map = useMap();
    const [mapElements, setMapElements] = useState([]);

    const types = [
        { value: 1, label: "Transitable con desvios y/o horarios de circulación", color: "#FFA500" },
        { value: 2, label: "No transitable por conflictos sociales", color: "#FF0000" },
        { value: 3, label: "Restricción vehicular", color: "#0000FF" },
        { value: 4, label: "No transitable tráfico cerrado", color: "#8B0000" },
        { value: 5, label: "Restricción vehicular, especial", color: "#4B0082" },
    ];

    useEffect(() => {
        fetchCarreteras();
    }, []);

    useEffect(() => {
        if (!map || carreteras.length === 0) return;

        // Limpiar elementos anteriores del mapa
        mapElements.forEach((element) => element.setMap(null));
        setMapElements([]);

        const newElements = [];

        carreteras.forEach((carretera) => {
            const puntosCarretera = carretera.puntosCarretera.map((punto) => ({
                lat: punto.latitud,
                lng: punto.longitud,
            }));

            const incidenteTipoId = carretera.incidencias?.[0]?.idTipoIncidente || null;
            const color = carretera.estaBloqueada
                ? types.find((type) => type.value === incidenteTipoId)?.color || "#FF0000"
                : "#00FFFF";

            const polyline = new window.google.maps.Polyline({
                path: puntosCarretera,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });

            polyline.setMap(map);
            newElements.push(polyline);

            const origenMarker = new window.google.maps.Marker({
                position: {
                    lat: carretera.municipioOrigen.latitud,
                    lng: carretera.municipioOrigen.longitud,
                },
                map: map,
                label: carretera.municipioOrigen.nombre,
            });

            const destinoMarker = new window.google.maps.Marker({
                position: {
                    lat: carretera.municipioDestino.latitud,
                    lng: carretera.municipioDestino.longitud,
                },
                map: map,
                label: carretera.municipioDestino.nombre,
            });

            newElements.push(origenMarker, destinoMarker);
        });

        setMapElements(newElements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carreteras, map]);

    const fetchCarreteras = async () => {
        try {
            const response = await axios.get("http://localhost:3000/carretera");
            setCarreteras(response.data);
        } catch (error) {
            console.error("Error al cargar las carreteras:", error);
        }
    };

    const filterCarreterasByType = async (typeId) => {
        try {
            if (!typeId) {
                fetchCarreteras();
                return;
            }
            const response = await axios.get(`http://localhost:3000/carretera/tipoIncidente/${typeId}`);
            setCarreteras(response.data);
        } catch (error) {
            console.error("Error al filtrar carreteras:", error);
        }
    };

    const handleShowMap = (carretera) => {
        setSelectedCarretera(carretera);
        const center = {
            lat: (carretera.municipioOrigen.latitud + carretera.municipioDestino.latitud) / 2,
            lng: (carretera.municipioOrigen.longitud + carretera.municipioDestino.longitud) / 2,
        };
        map.panTo(center);
    };

    const handleShowPopup = async (carretera) => {
        try {
            const response = await axios.get(`http://localhost:3000/incidente/carretera/${carretera.id}`);
            if (response.data.length > 0) {
                const firstIncident = response.data[0];
                setIncidentImage(`http://localhost:3000/incidente/foto/${firstIncident.id}`);
                setSelectedCarretera(carretera);
                setShowPopup(true);
            }
        } catch (error) {
            console.error("Error al obtener el motivo del bloqueo:", error);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setIncidentImage(null);
        setSelectedCarretera(null);
    };

    return (
        <>
        <NavMainMenu />
            <Container className="mt-3">
                <Row>
                    <Col>
                        <h1 className="text-center">Transporte en Bolivia</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Map
                                mapId="bf51a910020fa25a"
                                style={{ width: "100%", height: "500px" }}
                                defaultCenter={mapCenter}
                                defaultZoom={6}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Form.Select
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                filterCarreterasByType(e.target.value);
                            }}
                            className="mb-3"
                        >
                            <option value="">Filtrar por tipo de incidencia</option>
                            {types.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </Form.Select>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Municipio Origen</th>
                                    <th>Municipio Destino</th>
                                    <th>Bloqueada</th>
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
                                        <td>
                                            <Button
                                                variant="info"
                                                className="me-2"
                                                onClick={() => handleShowMap(carretera)}
                                            >
                                                Ver Carretera
                                            </Button>
                                            {carretera.estaBloqueada && (
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleShowPopup(carretera)}
                                                >
                                                    Ver Motivo
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            <Modal show={showPopup} onHide={handleClosePopup}>
                <Modal.Header closeButton>
                    <Modal.Title>Motivo del Bloqueo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {incidentImage && <img src={incidentImage} alt="Motivo" style={{ width: "100%" }} />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePopup}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MainPage;
