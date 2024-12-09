import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Container, Form, Alert } from "react-bootstrap";
import NavMainMenu from "./components/MainMenu";
import "./login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/usuario/login", {
        email,
        password,
      });
      console.log("Login exitoso:", response.data);

      localStorage.setItem("user", JSON.stringify(response.data));

      setError(null);
      navigate("/admin/municipios");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("El correo o la contraseña son incorrectos.");
    }
  };

  return (
    <>
      <NavMainMenu />
      <Container className="login-container">
        <Row className="justify-content-md-center">
          <Col md="6" lg="4">
            <Card className="login-card shadow">
              <Card.Body>
                <Card.Title className="text-center mb-4">Iniciar Sesión</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ingresa tu correo"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" className="w-100" onClick={handleLogin}>
                    Iniciar Sesión
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

export default LoginPage;
