import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Container, Form } from 'react-bootstrap';
import NavAdminMenu from '../../components/AdminMenu';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';

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
    const [user, setUser] = useState(null); // Obtener usuario desde localStorage

    useEffect(() => {
        getListaMunicipios();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser); // Cargar usuario
        setUltimoCambioId(storedUser?.id); // Cargar el ID del usuario
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
        setShowPopup(true);
    };

    const handleMapClick = (event) => {
        const newPoint = {
            latitud: event.latLng.lat(),
            longitud: event.latLng.lng(),
        };
        setPuntosCarretera([...puntosCarretera, newPoint]);
    };

    const guardarCarretera = async () => {
        const carreteraData = {
            nombre,
            estaBloqueada,
            idMunicipioOrigen,
            idMunicipioDestino,
            ultimoCambioId,
            usuarioId: user?.id, // Mandamos el id del usuario desde localStorage
        };

        try {
            const res = await axios.post("http://localhost:3000/carretera", carreteraData);
            const carreteraId = res.data.id; // Obtenemos el ID de la carretera creada

            // Ahora guardar los puntos de la carretera
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
                                                <option key={municipio.id} value={municipio.id}>{municipio.nombre}</option>
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
                                                <option key={municipio.id} value={municipio.id}>{municipio.nombre}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" onClick={trazarRuta}>Trazar Ruta</Button>
                                    <Button variant="success" onClick={guardarCarretera}>Guardar Carretera</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {showPopup && (
                <div className="popup">
                    <Map
                        mapId="bf51a910020fa25a"
                        style={{ width: "100%", height: "500px" }}
                        defaultCenter={{ lat: -17.4214, lng: -63.2115 }}
                        defaultZoom={6}
                        onClick={handleMapClick}
                    >
                        {puntosCarretera.map((point, index) => (
                            <AdvancedMarker
                                key={index}
                                position={{
                                    lat: point.latitud,
                                    lng: point.longitud,
                                }}
                            />
                        ))}
                    </Map>
                    <Button onClick={() => setShowPopup(false)}>Cerrar</Button>
                </div>
            )}
        </>
    );
};

export default FormCarreteras;
