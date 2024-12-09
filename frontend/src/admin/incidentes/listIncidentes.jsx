import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavAdminMenu from "../../components/AdminMenu";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

const ListIncidentes = () => {
    const [incidentes, setIncidentes] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedIncidente, setSelectedIncidente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markerArray, setMarkerArray] = useState([]);
    const [polylineArray, setPolylineArray] = useState([]);
    const map = useMap();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getListaIncidentes();
        document.title = "Lista de Incidentes";
    }, []);

    useEffect(() => {
        if (!map || markerArray.length < 1) return;

        const incidentMarker = new window.google.maps.Marker({
            position: markerArray[0],
            map: map,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "#FF0000",
                fillOpacity: 1,
                strokeColor: "#FF0000",
                strokeWeight: 1,
                scale: 8,
            },
        });

        if (polylineArray.length > 0) {
            const polyline = new window.google.maps.Polyline({
                path: polylineArray,
                geodesic: true,
                strokeColor: "#0000FF",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
            polyline.setMap(map);
        }

        return () => {
            incidentMarker.setMap(null);
        };
    }, [markerArray, polylineArray, map]);

    const getListaIncidentes = async () => {
        try {
            const res = await axios.get("http://localhost:3000/incidente");
            setIncidentes(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar los incidentes:", error);
            setLoading(false);
        }
    };

    const deleteIncidente = async (incidente) => {
        try {
            const idCarretera = incidente.idCarretera;
            const res = await axios.delete(`http://localhost:3000/incidente/${incidente.id}`);

            await axios.put(`http://localhost:3000/carretera/verificar/${idCarretera}`);
            console.log("Incidente eliminado:", res.data);
            getListaIncidentes();
        } catch (error) {
            console.error("Error al eliminar el incidente:", error);
        }
    };

    const handleShowMap = (incidente) => {
        setSelectedIncidente(incidente);
        setShowMap(true);

        const puntoIncidente = {
            lat: incidente.latitud,
            lng: incidente.longitud,
        };
        setMarkerArray([puntoIncidente]);

        const puntosCarretera = incidente.carretera.puntosCarretera.map(punto => ({
            lat: punto.latitud,
            lng: punto.longitud,
        }));
        setPolylineArray(puntosCarretera);
    };

    const handleCloseMap = () => {
        setShowMap(false);
        setMarkerArray([]);
        setPolylineArray([]);
    };

    const defaultCenter = {
        lat: -17.78629,
        lng: -63.18117,
    };


    return (
        <>
            <NavAdminMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card.Body>
                            <Card.Title className="text-center mt-3 mb-3">Lista de Incidentes</Card.Title>
                            {loading ? (
                                <p>Cargando incidentes...</p>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Imagen</th>
                                            <th>Tipo de Incidente</th>
                                            <th>Estado</th>
                                            <th>Carretera</th>
                                            <th>Ver en el Mapa</th>
                                            {user?.esAdmin && (<th>Ultimo cambio</th>)}
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incidentes.map((incidente) => (
                                            <tr key={incidente.id}>
                                                <td>
                                                    <img src={`http://localhost:3000/incidente/foto/${incidente.id}`} alt="Imagen del incidente" style={{ width: "100px" }} />
                                                </td>
                                                <td>{incidente.tipoIncidente.nombre}</td>
                                                <td>{incidente.estaConfirmada ? "Bloqueada" : "libre"}</td>
                                                <td>{incidente.carretera.nombre}</td>
                                                <td>
                                                    <Button variant="info" onClick={() => handleShowMap(incidente)}>Ver</Button>
                                                </td>
                                                {user?.esAdmin && (<td>
                                                    {incidente.usuarioUltimoCambioIncidente?.nombre || "No hay información"}
                                                </td> )}
                                                <td>
                                                    <Link to={`/admin/incidentes/formulario/${incidente.id}`}>
                                                        <Button variant="warning">Editar</Button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => deleteIncidente(incidente)}>Eliminar</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Col>
                </Row>
            </Container>

            <Modal show={showMap} onHide={handleCloseMap} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedIncidente?.tipoIncidente.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map
                        mapId="bf51a910020fa25a"
                        style={{ width: "100%", height: "500px" }}
                        defaultCenter={defaultCenter}
                        defaultZoom={12}
                    >

                        {selectedIncidente && (
                            <AdvancedMarker
                                position={{
                                    lat: selectedIncidente.latitud,
                                    lng: selectedIncidente.longitud,
                                }}
                                title="Lugar del Incidente"
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    fillColor: "#FF0000",
                                    fillOpacity: 1,
                                    strokeColor: "#FF0000",
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

export default ListIncidentes;
