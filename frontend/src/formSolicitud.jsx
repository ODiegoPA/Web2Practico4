import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { Button, Card, Col, Row, Container, Form } from "react-bootstrap";
import NavMainMenu from "./components/MainMenu";

const FormSolicitud = () => {
    const navigate = useNavigate();
    const [estaConfirmada] = useState(false);
    const [idTipoIncidente, setIdTipoIncidente] = useState("");
    const [idCarretera, setIdCarretera] = useState("");
    const [tiposIncidentes, setTiposIncidentes] = useState([]);
    const [carreteras, setCarreteras] = useState([]);
    const [photo, setPhoto] = useState(null);

    const onChangePhoto = (e) => {
        setPhoto(e.target.files[0]);
    };

    useEffect(() => {
        getTiposIncidentes();
        getCarreteras();
        document.title = "Formulario de Solicitud";
    }, []);

    const getTiposIncidentes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/tipoIncidente");
            setTiposIncidentes(response.data);
        } catch (error) {
            console.error("Error al cargar los tipos de incidentes:", error);
        }
    }

    const getCarreteras = async () => {
        try {
            const response = await axios.get("http://localhost:3000/carretera");
            setCarreteras(response.data);
        } catch (error) {
            console.error("Error al cargar las carreteras:", error);
        }
    }

    const guardarSolicitud = async () => {
        const formData = new FormData();
        formData.append("estaConfirmada", estaConfirmada);
        formData.append("idTipoIncidente", idTipoIncidente);
        formData.append("idCarretera", idCarretera);
        formData.append("photo", photo);

        try {
            await axios.post("http://localhost:3000/incidente", formData);
            navigate("/home");
        } catch (error) {
            console.error("Error al guardar la solicitud:", error);
        }
    }
    return ( 
        <>
            <NavMainMenu />
            <Container className="mt-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Formulario de Solicitud</Card.Title>
                                <Form>
                                    <Form.Group className="mb-3" controlId="idTipoIncidente">
                                        <Form.Label>Tipo de Incidente</Form.Label>
                                        <Form.Select required onChange={(e) => setIdTipoIncidente(e.target.value)}>
                                            <option value="">Selecciona un tipo de incidente</option>
                                            {tiposIncidentes.map((tipoIncidente) => (
                                                <option key={tipoIncidente.id} value={tipoIncidente.id}>{tipoIncidente.nombre}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="idCarretera">
                                        <Form.Label>Carretera</Form.Label>
                                        <Form.Select required onChange={(e) => setIdCarretera(e.target.value)}>
                                            <option value="">Selecciona una carretera</option>
                                            {carreteras.map((carretera) => (
                                                <option key={carretera.id} value={carretera.id}>{carretera.nombre}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="photo">
                                        <Form.Label>Foto</Form.Label>
                                        <Form.Control required type="file" onChange={onChangePhoto} />
                                    </Form.Group>
                                    <Button variant="primary" onClick={guardarSolicitud}>Guardar</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
     );
}
 
export default FormSolicitud;