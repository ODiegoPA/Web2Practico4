import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form } from "react-bootstrap";
import NavAdminMenu from '../../components/AdminMenu';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const FormMunicipios = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [ultimoCambioId, setUltimoCambioId] = useState("");

    useEffect(() => {
        if (!id) return;
        getMunicipio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getMunicipio = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/municipio/${id}`);
            setNombre(response.data.nombre);
            setLatitud(response.data.latitud);
            setLongitud(response.data.longitud);
            setUltimoCambioId(JSON.parse(localStorage.getItem("user")).id);
        } catch (error) {
            console.error("Error al cargar el municipio:", error);
        }
    };

    const guardarMunicipio = async () => {
        if (!nombre || !latitud || !longitud) {
            console.error("Por favor, completa todos los campos.");
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("latitud", latitud);
        formData.append("longitud", longitud);
        formData.append("ultimoCambioId", ultimoCambioId);

        try {
            if (id) {
                axios.put(`http://localhost:3000/municipio/${id}`, formData)
                .then(() => {
                    navigate("/admin/municipios");
                })
                .catch(error => {
                    console.error("Error al actualizar el municipio:", error);
                });
            } else {
                axios.post("http://localhost:3000/municipio", formData)
                .then(() =>{
                    navigate("/admin/municipios");
                })
                .catch(error => {
                    console.error("Error al guardar el municipio:", error);
                });
            }
        } catch (error) {
            console.error("Error al guardar el municipio:", error);
        }
    };

    const handleMapClick = (event) => {
        setLatitud(event.latLng.lat());
        setLongitud(event.latLng.lng());
    };

    const centro = {
        lat: -17.4214, 
        lng: -63.2115,
    };

    const containerStyle = {
        width: "100%",
        height: "300px",
    };

    const mapCenter = latitud && longitud ? { lat: parseFloat(latitud), lng: parseFloat(longitud) } : centro;

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

                                    <LoadScript googleMapsApiKey="AIzaSyC5j_NfH5CoSXxxZY7XaKyLaAV_G08zkb8">
                                        <GoogleMap
                                            mapContainerStyle={containerStyle}
                                            center={mapCenter}
                                            zoom={6}
                                            onClick={handleMapClick}
                                        >
                                            {latitud && longitud && (
                                                <Marker position={{ lat: parseFloat(latitud), lng: parseFloat(longitud) }} />
                                            )}
                                        </GoogleMap>
                                    </LoadScript>

                                    <Button variant="primary" onClick={guardarMunicipio}>
                                        {id ? "Actualizar" : "Guardar"}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default FormMunicipios;
