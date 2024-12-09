import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form } from "react-bootstrap";
import NavAdminMenu from '../../components/AdminMenu';

const FormTiposIncidentes = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState("");

    useEffect(() => {
        if (id) {
            getTipoIncidenteById();
        }
        document.title = "Formulario de Tipos de Incidentes";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getTipoIncidenteById = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/tipoIncidente/${id}`);
            const tipoIncidente = res.data;
            setNombre(tipoIncidente.nombre);
        } catch (error) {
            console.error("Error al cargar el tipo de incidente:", error);
        }
    }

    const guardarTipoIncidente = async () => {
        const tipoIncidenteData = {
            nombre,
            ultimoCambioId: JSON.parse(localStorage.getItem("user")).id,
        };

        try {
            if (id) {
                const res = await axios.put(`http://localhost:3000/tipoIncidente/${id}`, tipoIncidenteData);
                console.log("Tipo de incidente actualizado:", res.data);
            } else {
                const res = await axios.post("http://localhost:3000/tipoIncidente", tipoIncidenteData);
                console.log("Tipo de incidente creado:", res.data);
            }
            navigate("/admin/tipoIncidentes");
        } catch (error) {
            console.error("Error al guardar el tipo de incidente:", error);
        }
    }
    return (
        <>
        <NavAdminMenu />
            <Container className="mt-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Formulario de Tipos de Incidentes</Card.Title>
                                <Form>
                                    <Form.Group className="mb-3" controlId="nombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" onClick={guardarTipoIncidente}>
                                        Guardar
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
     );
}
 
export default FormTiposIncidentes;