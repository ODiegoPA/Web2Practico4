import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form, Modal } from "react-bootstrap";
import NavAdminMenu from "../../components/AdminMenu";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

const FormIncidentes = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    // eslint-disable-next-line no-unused-vars
    const [estaConfirmada, setEstaConfirmada] = useState(false);
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [idTipoIncidente, setIdTipoIncidente] = useState("");
    const [ultimoCambioId, setUltimoCambioId] = useState(JSON.parse(localStorage.getItem("user")).id);
    const [idCarretera, setIdCarretera] = useState("");
    const [carreteras, setCarreteras] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [tiposIncidentes, setTiposIncidentes] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [polylineArray, setPolylineArray] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const map = useMap();

    const onChangePhoto = (e) => {
        setPhoto(e.target.files[0]);
    };

    useEffect(() => {
        if (id){
            getIncidenteById();
        }
        document.title = "Formulario de Incidentes";
        getCarreteras();
        getTiposIncidentes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (!map || polylineArray.length === 0) return;

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

    const getIncidenteById = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/incidente/${id}`);
            setEstaConfirmada(response.data.estaConfirmada);
            setLatitud(response.data.latitud);
            setLongitud(response.data.longitud);
            setIdTipoIncidente(response.data.idTipoIncidente);
            setUltimoCambioId(JSON.parse(localStorage.getItem("user")).id);
            setIdCarretera(response.data.idCarretera);
        } catch (error) {
            console.error("Error al cargar el incidente:", error);
        }
    };

    const getCarreteras = async () => {
        try {
            const response = await axios.get("http://localhost:3000/carretera");
            setCarreteras(response.data);
        } catch (error) {
            console.error("Error al cargar las carreteras:", error);
        }
    };

    const getTiposIncidentes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/tipoIncidente");
            setTiposIncidentes(response.data);
        } catch (error) {
            console.error("Error al cargar los tipos de incidentes:", error);
        }
    };

    const handleMapClick = (event) => {
        if (event.detail && event.detail.latLng) {
            const newPosition = {
                lat: event.detail.latLng.lat,
                lng: event.detail.latLng.lng,
            };
            setSelectedPosition(newPosition);
            setLatitud(newPosition.lat); // Sincronizar latitud
            setLongitud(newPosition.lng); // Sincronizar longitud
        } else {
            console.error("No se pudo obtener la posición del clic en el mapa:", event);
        }
    };
    

    const handleShowMap = () => {
        if (!idCarretera) {
            alert("Por favor, selecciona una carretera antes de abrir el mapa.");
            return;
        }

        // Obtener los puntos de la carretera seleccionada
        const carreteraSeleccionada = carreteras.find((carretera) => carretera.id === parseInt(idCarretera));
        if (carreteraSeleccionada && carreteraSeleccionada.puntosCarretera) {
            setPolylineArray(
                carreteraSeleccionada.puntosCarretera.map((punto) => ({
                    lat: punto.latitud,
                    lng: punto.longitud,
                }))
            );
        }

        setShowMap(true);
    };

    const handleCloseMap = () => {
        setShowMap(false);
        setPolylineArray([]);
    };

    const guardarIncidente = async (e) => {
        e.preventDefault();
        // Validar que las coordenadas estén completas
        const lat = selectedPosition?.lat || latitud;
        const lng = selectedPosition?.lng || longitud;
    
        if (!lat || !lng || !idTipoIncidente || !ultimoCambioId) {
            console.error("Por favor, completa todos los campos.");
            console.log("latitud", lat);
            console.log("longitud", lng);
            console.log("idTipoIncidente", idTipoIncidente);
            console.log("ultimoCambioId", ultimoCambioId);
            console.log("idCarretera", idCarretera);
            return;
        }
    
        const formData = new FormData();
        formData.append("estaConfirmada", true);
        formData.append("latitud", lat);
        formData.append("longitud", lng);
        formData.append("idTipoIncidente", idTipoIncidente);
        formData.append("ultimoCambioId", ultimoCambioId);
        formData.append("idCarretera", idCarretera);
        if (photo) {
            formData.append("photo", photo);
        }
        try {
            if (id) {
                await axios.put(`http://localhost:3000/incidente/${id}`, formData).then(() => {
                    navigate("/admin/incidentes");
                });
            } else {
                await axios.post("http://localhost:3000/incidente", formData).then(() => {
                    axios.put(`http://localhost:3000/carretera/verificar/${idCarretera}`);
                    navigate("/admin/incidentes");
                });
            }
        } catch (error) {
            console.error("Error al guardar el incidente:", error);
        }
    };

    return (
        <>
            <NavAdminMenu />
            <Container className="mt-3">
                <Card>
                    <Card.Body>
                        <Form onSubmit={guardarIncidente}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="idCarretera">
                                        <Form.Label>Carretera</Form.Label>
                                        <Form.Select
                                            value={idCarretera}
                                            onChange={(e) => setIdCarretera(e.target.value)}
                                        >
                                            <option value="">Selecciona una carretera</option>
                                            {carreteras.map((carretera) => (
                                                <option key={carretera.id} value={carretera.id}>
                                                    {carretera.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="idTipoIncidente">
                                        <Form.Label>Tipo de Incidente</Form.Label>
                                        <Form.Select
                                            value={idTipoIncidente}
                                            onChange={(e) => setIdTipoIncidente(e.target.value)}
                                        >
                                            <option value="">Selecciona un tipo</option>
                                            {tiposIncidentes.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Form.Group controlId="photo">
                                        <Form.Label>Foto</Form.Label>
                                        <Form.Control type="file" onChange={onChangePhoto} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Button variant="primary" className="mt-4" onClick={handleShowMap}>
                                        Seleccionar Ubicación en el Mapa
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Form.Group controlId="latitud">
                                        <Form.Label>Latitud</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={latitud}
                                            readOnly
                                            placeholder="Selecciona una ubicación en el mapa"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="longitud">
                                        <Form.Label>Longitud</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={longitud}
                                            readOnly
                                            placeholder="Selecciona una ubicación en el mapa"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mt-4">
                                <Col>
                                    <Button type="submit" variant="success">
                                        Guardar
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showMap} onHide={handleCloseMap} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Ubicación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map
                        mapId="bf51a910020fa25a"
                        style={{ width: "100%", height: "500px" }}
                        defaultCenter={{ lat:  -17.78629, lng:-63.18117 }}
                        defaultZoom={8}
                        onClick={handleMapClick}
                    >
                        {/* Agregar un marcador si se selecciona una posición */}
                        {selectedPosition && (
                            <AdvancedMarker
                                position={selectedPosition}
                                title="Ubicación Seleccionada"
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
                    <Button variant="secondary" onClick={handleCloseMap}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default FormIncidentes;
