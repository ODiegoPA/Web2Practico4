import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavAdminMenu = () => {
    const navigate = useNavigate();

    // Recuperar usuario de localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <Navbar bg="dark" variant="dark" className="nav-bar shadow">
            <Container>
                <Navbar.Brand href="/home" className="brand-title">
                    TransporteBO
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Municipios" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={"/admin/municipios"}>Lista de Municipios</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={"/admin/municipios/formulario"}>Agregar Municipio</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Carreteras" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={"/admin/carreteras"}>Lista de Carreteras</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={"/admin/carreteras/formulario"}>Agregar Carretera</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Incidentes" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={"/admin/incidentes"}>Lista de Incidentes</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={"/admin/incidentes/formulario"}>Agregar Incidente</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Tipos de Incidentes" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={"/admin/tipoIncidentes"}>Lista de Tipos de Incidentes</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={"/admin/tipoIncidentes/formulario"}>Agregar Tipo de Incidente</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Usuarios" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={"/admin/usuarios"}>Lista de Usuarios</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={"/admin/usuarios/formulario"}>Agregar Usuario</NavDropdown.Item>
                        </NavDropdown>
                        {user && (
                            <Button variant="outline-light" className="nav-button" onClick={handleLogout}>
                                Cerrar Sesión, {user.nombre}
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavAdminMenu;
