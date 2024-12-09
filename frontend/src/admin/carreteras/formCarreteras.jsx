import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form, Modal } from "react-bootstrap";
import NavAdminMenu from "../../components/AdminMenu";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

const FormCarreteras = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [estaBloqueada, setEstaBloqueada] = useState(false);
    const [idMunicipioOrigen, setIdMunicipioOrigen] = useState("");
    const [idMunicipioDestino, setIdMunicipioDestino] = useState("");
    const [ultimoCambioId, setUltimoCambioId] = useState("");
    const [listaMunicipios, setListaMunicipios] = useState([]);
    const [puntosCarretera, setPuntosCarretera] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
    const [origenCoords, setOrigenCoords] = useState(null);
    const [destinoCoords, setDestinoCoords] = useState(null);
    const map = useMap();

    useEffect(() => {
        getListaMunicipios();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUltimoCambioId(storedUser?.id);
        document.title = "Formulario de Carreteras";
    }, []);

    const getListaMunicipios = async () => {
        try {
            const res = await axios.get("http://localhost:3000/municipio");
            setListaMunicipios(res.data);
        } catch (error) {
            console.error("Error al cargar los municipios:", error);
        }
    };

    const trazarRuta = () => {
        if (!idMunicipioOrigen || !idMunicipioDestino) {
            alert("Por favor selecciona el municipio de origen y destino antes de trazar la ruta.");
            return;
        }

        const municipioOrigen = listaMunicipios.find((m) => m.id === parseInt(idMunicipioOrigen));
        const municipioDestino = listaMunicipios.find((m) => m.id === parseInt(idMunicipioDestino));

        if (!municipioOrigen || !municipioDestino) {
            alert("Error al cargar las coordenadas de los municipios.");
            return;
        }

        const center = {
            lat: (municipioOrigen.latitud + municipioDestino.latitud) / 2,
            lng: (municipioOrigen.longitud + municipioDestino.longitud) / 2,
        };

        setOrigenCoords({ lat: municipioOrigen.latitud, lng: municipioOrigen.longitud });
        setDestinoCoords({ lat: municipioDestino.latitud, lng: municipioDestino.longitud });
        setMapCenter(center);
        setShowPopup(true);
    };

    const handleMapClick = (event) => {
        const newPoint = {
            latitud: event.detail.latLng.lat,
            longitud: event.detail.latLng.lng,
        };
        setPuntosCarretera((prev) => [...prev, newPoint]);

        new window.google.maps.Marker({
            position: { lat: newPoint.latitud, lng: newPoint.longitud },
            map: map,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "#0000FF",
                fillOpacity: 1,
                strokeColor: "#0000FF",
                strokeWeight: 1,
                scale: 6,
            },
        });
    };

    const guardarCarretera = async () => {
        if (!nombre || !idMunicipioOrigen || !idMunicipioDestino) {
            alert("Por favor completa todos los campos antes de guardar.");
            return;
        }

        if (puntosCarretera.length === 0) {
            alert("Por favor traza la ruta antes de guardar.");
            return;
        }

        const carreteraData = {
            nombre,
            estaBloqueada,
            idMunicipioOrigen,
            idMunicipioDestino,
            ultimoCambioId,
        };

        try {
            const res = await axios.post("http://localhost:3000/carretera", carreteraData);
            const carreteraId = res.data.id;

            for (const punto of puntosCarretera) {
                await axios.post("http://localhost:3000/puntosCarretera", {
                    latitud: punto.latitud,
                    longitud: punto.longitud,
                    idCarretera: carreteraId,
                });
            }

            navigate("/admin/carreteras");
        } catch (error) {
            console.error("Error al guardar la carretera:", error);
        }
    };

    return (
        <>
            <NavAdminMenu />
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title>Formulario de Carreteras</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Nombre de la Carretera</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre de la Carretera"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>¿Está bloqueada?</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            label="¿Está bloqueada?"
                                            checked={estaBloqueada}
                                            onChange={(e) => setEstaBloqueada(e.target.checked)}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Municipio de Origen</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={idMunicipioOrigen}
                                            onChange={(e) => setIdMunicipioOrigen(e.target.value)}
                                        >
                                            <option value="">Selecciona un municipio</option>
                                            {listaMunicipios.map((municipio) => (
                                                <option key={municipio.id} value={municipio.id}>
                                                    {municipio.nombre}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Municipio de Destino</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={idMunicipioDestino}
                                            onChange={(e) => setIdMunicipioDestino(e.target.value)}
                                        >
                                            <option value="">Selecciona un municipio</option>
                                            {listaMunicipios.map((municipio) => (
                                                <option key={municipio.id} value={municipio.id}>
                                                    {municipio.nombre}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" className="me-2" onClick={trazarRuta}>
                                        Trazar Ruta
                                    </Button>
                                    <Button variant="success" onClick={guardarCarretera}>
                                        Guardar Carretera
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal show={showPopup} onHide={() => setShowPopup(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Trazar Ruta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map
                        mapId="bf51a910020fa25a"
                        style={{ width: "100%", height: "500px" }}
                        defaultCenter={mapCenter}
                        defaultZoom={8}
                        onClick={handleMapClick}
                    >
                        {origenCoords && (
                            <AdvancedMarker
                                position={origenCoords}
                                title="Municipio de Origen"
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    fillColor: "#00FF00",
                                    fillOpacity: 1,
                                    strokeColor: "#000000",
                                    strokeWeight: 1,
                                    scale: 8,
                                }}
                            />
                        )}
                        {destinoCoords && (
                            <AdvancedMarker
                                position={destinoCoords}
                                title="Municipio de Destino"
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    fillColor: "#FF0000",
                                    fillOpacity: 1,
                                    strokeColor: "#000000",
                                    strokeWeight: 1,
                                    scale: 8,
                                }}
                            />
                        )}
                    </Map>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPopup(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FormCarreteras;
