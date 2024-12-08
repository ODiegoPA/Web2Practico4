import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { APIProvider } from '@vis.gl/react-google-maps';// Importa el contexto
import MapaCarreteras from "./prueba.jsx";
import LoginPage from "./login.jsx";
import App from "./App.jsx";
import ListMunicipios from "./admin/municipios/listMunicipios.jsx";
import FormMunicipios from "./admin/municipios/formMunicipios.jsx";
import ListCarreteras from "./admin/carreteras/listCarreteras.jsx";
import FormCarreteras from "./admin/carreteras/formCarreteras.jsx";
import ListIncidentes from "./admin/incidentes/listIncidentes.jsx";
import ListTiposIncidentes from "./admin/tiposIncidentes/tiposIncidentes.jsx";
import FormTiposIncidentes from "./admin/tiposIncidentes/formTiposIncidentes.jsx";
import ListUsuarios from "./admin/usuarios/listUsuarios.jsx";
import FormUsuarios from "./admin/usuarios/formUsuarios.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <MapaCarreteras />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin/municipios",
    element: <ListMunicipios />,
  },
  {
    path: "/admin/municipios/formulario",
    element: <FormMunicipios />,
  },
  {
    path: "/admin/municipios/formulario/:id",
    element: <FormMunicipios />,
  },
  {
    path: "/admin/carreteras",
    element : <ListCarreteras />,
  },
  {
    path: "/admin/carreteras/formulario",
    element: <FormCarreteras />,
  },
  {
    path: "/admin/incidentes",
    element: <ListIncidentes />,
  },
  {
    path: "/admin/tipoIncidentes",
    element: <ListTiposIncidentes />,
  },
  {
    path: "/admin/tipoIncidentes/formulario",
    element: <FormTiposIncidentes />,
  },
  {
    path: "/admin/tipoIncidentes/formulario/:id",
    element: <FormTiposIncidentes />,
  },
  {
    path: "/admin/usuarios",
    element: <ListUsuarios />,
  },
  {
    path: "/admin/usuarios/formulario",
    element: <FormUsuarios />,
  },
  {
    path: "/admin/usuarios/formulario/:id",
    element: <FormUsuarios />,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <APIProvider apiKey={"TU_API_ACA"}>
      <RouterProvider router={router} />
    </APIProvider>
  </StrictMode>
);
