import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavAdminMenu from "../../components/AdminMenu";

const ListTiposIncidentes = () => {
    const [tiposIncidentes, setTiposIncidentes] = useState([]);

    useEffect(() => {
        getListTiposIncidentes();
        document.title = "Lista de Tipos de Incidentes";
    }, []);

    const getListTiposIncidentes = async () => {
        axios.get("http://localhost:3000/tipoIncidente")
            .then((res) => {
                setTiposIncidentes(res.data);
            })
            .catch((error) => {
                console.error("Error al cargar los tipos de incidentes:", error);
            });
    }

    const deleteTipoIncidente = async (id) => {
        const confirm = window.confirm("¿Estás seguro de eliminar este tipo de incidente?");
        if (!confirm) return;
        try {
            const res = await axios.delete(`http://localhost:3000/tipoIncidente/${id}`);
            console.log("Tipo de incidente eliminado:", res.data);
            getListTiposIncidentes();
        } catch (error) {
            console.error("Error al eliminar el tipo de incidente:", error);
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
                                <Card.Title>Lista de Tipos de Incidentes</Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Ultimo Cambio</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tiposIncidentes.map((tipoIncidente) => (
                                            <tr key={tipoIncidente.id}>
                                                <td>{tipoIncidente.nombre}</td>
                                                <td>{tipoIncidente.usuarioUltimoCambioTipoIncidente.nombre}</td>
                                                <td>
                                                    <Link to={`/admin/tipoIncidentes/formulario/${tipoIncidente.id}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                                                </td>
                                                <td>
                                                <Button variant="danger" size="sm" onClick={() => deleteTipoIncidente(tipoIncidente.id)}>Eliminar</Button>
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
        </>
     );
}
 
export default ListTiposIncidentes;