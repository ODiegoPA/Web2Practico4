import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavAdminMenu from "../../components/AdminMenu";

const ListUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        getListUsuarios();
    }, []);

    const getListUsuarios = async () => {
        try {
            const res = await axios.get("http://localhost:3000/usuario");
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error al cargar los usuarios:", error);
        }
    };

    const deleteUsuario = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/usuario/${id}`);
            getListUsuarios();
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const handleShowPasswordModal = (usuario) => {
        setSelectedUsuario(usuario);
        setShowPasswordModal(true);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setNewPassword("");
    };

    const handleChangePassword = async () => {
        try {
            await axios.put(`http://localhost:3000/usuario/password/${selectedUsuario.id}`, { password: newPassword });
            handleClosePasswordModal();
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
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
                                <Card.Title className="text-center mt-3 mb-3">Lista de Usuarios</Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Correo</th>
                                            <th>Ultimo Cambio</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map((usuario) => (
                                            <tr key={usuario.id}>
                                                <td>{usuario.nombre}</td>
                                                <td>{usuario.correo}</td>

                                                <td>
                                                    <Button variant="warning" size="sm" onClick={() => handleShowPasswordModal(usuario)}>Cambiar Contraseña</Button>
                                                </td>
                                                <td>
                                                    <Link to={`/admin/usuarios/formulario/${usuario.id}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => deleteUsuario(usuario.id)}>Eliminar</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal para cambiar la contraseña */}
            <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewPassword">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese la nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePasswordModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleChangePassword}>
                        Cambiar Contraseña
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ListUsuarios;