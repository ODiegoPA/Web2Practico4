import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form, Modal } from "react-bootstrap";
import NavAdminMenu from "../../components/AdminMenu";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const FormMunicipios = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [ultimoCambioId, setUltimoCambioId] = useState("");
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        if (id) {
            getMunicipio();
        }
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUltimoCambioId(storedUser?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getMunicipio = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/municipio/${id}`);
            setNombre(response.data.nombre);
            setLatitud(response.data.latitud);
            setLongitud(response.data.longitud);
        } catch (error) {
            console.error("Error al cargar el municipio:", error);
        }
    };

    const guardarMunicipio = async () => {
        if (!nombre || !latitud || !longitud) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("latitud", latitud);
        formData.append("longitud", longitud);
        formData.append("ultimoCambioId", ultimoCambioId);

        try {
            if (id) {
                await axios.put(`http://localhost:3000/municipio/${id}`, formData);
            } else {
                await axios.post("http://localhost:3000/municipio", formData);
            }
            navigate("/admin/municipios");
        } catch (error) {
            console.error("Error al guardar el municipio:", error);
        }
    };

    const handleMapClick = (event) => {
        if (event.detail && event.detail.latLng) {
            setLatitud(event.detail.latLng.lat);
            setLongitud(event.detail.latLng.lng);
        }
    };

    const openMapModal = () => setShowMap(true);
    const closeMapModal = () => setShowMap(false);

    const defaultCenter = {
        lat: -16.2902, // Centro de Bolivia
        lng: -63.5887,
    };

    const mapCenter = latitud && longitud
        ? { lat: parseFloat(latitud), lng: parseFloat(longitud) }
        : defaultCenter;

    return (
        <>
            <NavAdminMenu />
            <Container className="mt-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-center mt-3 mb-3">
                                    {id ? "Editar Municipio" : "Agregar Municipio"}
                                </Card.Title>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa el nombre del municipio"
                                            value={nombre}
                                            onChange={(event) => setNombre(event.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Latitud</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Latitud (Haz clic en el mapa)"
                                            value={latitud}
                                            readOnly
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Longitud</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Longitud (Haz clic en el mapa)"
                                            value={longitud}
                                            readOnly
                                        />
                                    </Form.Group>

                                    <Button variant="primary" className="me-2" onClick={openMapModal}>
                                        Seleccionar Ubicación en el Mapa
                                    </Button>
                                    <Button variant="success" onClick={guardarMunicipio}>
                                        {id ? "Actualizar" : "Guardar"}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal para el Mapa */}
            <Modal show={showMap} onHide={closeMapModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Ubicación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map
                        mapId="bf51a910020fa25a"
                        style={{ width: "100%", height: "500px" }}
                        defaultCenter={mapCenter}
                        defaultZoom={6} // Zoom para mostrar Bolivia
                        onClick={handleMapClick}
                    >
                        {latitud && longitud && (
                            <AdvancedMarker
                                position={{ lat: parseFloat(latitud), lng: parseFloat(longitud) }}
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
                    <Button variant="secondary" onClick={closeMapModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FormMunicipios;
