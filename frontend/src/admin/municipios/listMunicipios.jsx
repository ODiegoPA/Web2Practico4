import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavAdminMenu from "../../components/AdminMenu";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const ListMunicipios = () => {
    const [municipios, setMunicipios] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedMunicipio, setSelectedMunicipio] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getListMunicipios();
        document.title = "Lista de Municipios";
    }, []);

    const getListMunicipios = async () => {
        try {
            const res = await axios.get("http://localhost:3000/municipio");
            console.log("Municipios cargados:", res.data);
            setMunicipios(res.data);
        } catch (error) {
            console.error("Error al cargar los municipios:", error);
        }
    };

    const deleteMunicipio = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:3000/municipio/${id}`);
            console.log("Municipio eliminado:", res.data);
            getListMunicipios();
        } catch (error) {
            console.error("Error al eliminar el municipio:", error);
        }
    };

    const handleShowMap = (municipio) => {
        setSelectedMunicipio(municipio);
        setShowMap(true);
    };

    const handleCloseMap = () => setShowMap(false);

    return (
        <>
            <NavAdminMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card.Body>
                            <Card.Title className="text-center mt-3 mb-3">Lista de Municipios</Card.Title>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        {user?.esAdmin &&(<th>Ultimo cambio</th>)}
                                        <th>Ver en Mapa</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {municipios.map((municipio) => (
                                        <tr key={municipio.id}>
                                            <td>{municipio.nombre}</td>
                                            {user?.esAdmin && (<td>{municipio.usuarioUltimoCambio.nombre}</td>)}
                                            <td>
                                                <Button variant="primary" onClick={() => handleShowMap(municipio)}>
                                                    Ver en Mapa
                                                </Button>
                                            </td>
                                            <td>
                                                <Link to={`/admin/municipios/formulario/${municipio.id}`}>
                                                    <Button variant="warning" className="me-2">
                                                        Editar
                                                    </Button>
                                                </Link>
                                            </td>
                                            <td>
                                                <Button variant="danger" onClick={() => deleteMunicipio(municipio.id)}>
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Col>
                </Row>
            </Container>
            <Modal show={showMap} onHide={handleCloseMap} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Ubicación de {selectedMunicipio?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMunicipio && (
                        <Map
                            mapId="bf51a910020fa25a"
                            style={{ width: "100%", height: "500px" }}
                            defaultCenter={{
                                lat: selectedMunicipio.latitud,
                                lng: selectedMunicipio.longitud,
                            }}
                            defaultZoom={12}
                        >
                            <AdvancedMarker
                                position={{
                                    lat: selectedMunicipio.latitud,
                                    lng: selectedMunicipio.longitud,
                                }}
                                title={`Ubicación de ${selectedMunicipio.nombre}`}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    fillColor: "#FF0000",
                                    fillOpacity: 1,
                                    strokeColor: "#000000",
                                    strokeWeight: 1,
                                    scale: 8,
                                }}
                            />
                        </Map>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ListMunicipios;
