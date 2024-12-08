import { Container, Navbar, Button, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./MainMenu.css";

const NavMainMenu = () => {
  const navigate = useNavigate();

  // Recuperar usuario de localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // Eliminar usuario de localStorage
    localStorage.removeItem("user");

    // Redirigir a la página de inicio
    navigate("/home");
  };

  return (
    <Navbar bg="dark" variant="dark" className="nav-bar shadow">
      <Container>
        <Navbar.Brand href="/home" className="brand-title">
          TransporteBO
        </Navbar.Brand>
        <Nav className="ms-auto">
          {user ? (
            <>
              <Link to="/admin">
                <Button variant="outline-light" className="nav-button">
                  Panel de Administración
                </Button>
              </Link>
              <Button variant="outline-light" className="nav-button" onClick={handleLogout}>
                Cerrar Sesión, {user.nombre}
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline-light" className="nav-button">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavMainMenu;
