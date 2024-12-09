import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form } from "react-bootstrap";
import NavAdminMenu from '../../components/AdminMenu';

const FormUsuarios = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ultimoCambioId] = useState(
        JSON.parse(localStorage.getItem("user"))?.id || ""
    );
    const [esAdmin, setEsAdmin] = useState(false);

    useEffect(() => {
        if (!id) return;
        getUsuario();
        document.title = id ? "Editar Usuario" : "Crear Usuario";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getUsuario = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/usuario/${id}`);
            const usuario = res.data;
            setNombre(usuario.nombre);
            setEmail(usuario.correo);
            setEsAdmin(usuario.esAdmin);
        } catch (error) {
            console.error("Error al cargar el usuario:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !email || (!id && !password)) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const usuarioData = { 
            nombre, 
            email, 
            password: id ? undefined : password, // Solo enviar si se está creando
            esAdmin, 
            ultimoCambioId 
        };

        try {
            if (id) {
                await axios.put(`http://localhost:3000/usuario/${id}`, usuarioData);
            } else {
                await axios.post("http://localhost:3000/usuario", usuarioData);
            }
            navigate("/admin/usuarios");
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    };

    return (
        <>
            <NavAdminMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="text-center mt-3 mb-3">
                                    {id ? "Editar Usuario" : "Crear Usuario"}
                                </Card.Title>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formNombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el nombre"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formCorreo" className="mt-3">
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Ingrese el correo"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    {!id && (
                                        <Form.Group controlId="formContrasena" className="mt-3">
                                            <Form.Label>Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Ingrese la contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    )}
                                    <Form.Group controlId="formEsAdmin" className="mt-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Es Administrador"
                                            checked={esAdmin}
                                            onChange={(e) => setEsAdmin(e.target.checked)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-3">
                                        {id ? "Guardar Cambios" : "Crear Usuario"}
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

export default FormUsuarios;
