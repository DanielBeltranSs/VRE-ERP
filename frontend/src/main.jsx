import ReactDOM from 'react-dom/client';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './routes/App.jsx';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import ProyectoList from './components/ProyectoList.jsx';
import './components/Proyectos.jsx';
import './index.css';
import Proyectos from './components/Proyectos.jsx';
import ModificarProyecto from './components/ModificarProyecto.jsx';
import Foro from './routes/Foro/Foro.jsx';
import Asistencia from './components/AttendanceForm.jsx';
import NuevoForo from './routes/Foro/ForoPublicacion.jsx';
import UserManagement from './components/UserManagement.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AgregarProyecto from './components/AgregarProyecto.jsx';
import AgregarActividad from './components/AgregarActividades.jsx';
import Inventario from './routes/Inventario/Inventario.jsx';
import Material from './routes/Inventario/material.jsx';
import Almacen from './routes/Inventario/almacen.jsx';
import AddInventario from './routes/Inventario/AddInventario.jsx';
import EditarInventario from './routes/Inventario/EditarInventario.jsx';
import InventarioProyecto from './routes/Inventario/InventarioDeProyecto.jsx';
import AddProyectoInventario from './routes/Inventario/addProyectoInventario.jsx';
import VerInventarioProyecto from './routes/Inventario/verInventarioProyecto.jsx';
import EditarAlmacen from './routes/Inventario/Editalmacen.jsx';
import MisPublicaciones from './routes/Foro/MisPublicaciones.jsx';
import EditarMisPublicaciones from './routes/Foro/EditarMisPublicaiones.jsx';
import EditarMaterial from './routes/Inventario/ModalAddMaterial.jsx';
import MaddIP from './routes/Inventario/MaddIP.jsx';
import AssignmentSystem from './components/AssignmentForm.jsx';
import AssignmentList from './components/AssignmentList.jsx';
// Dentro de tu configuración de rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/proyectos',
        element: <Proyectos />,
      },
      {
        path: '/proyectos/ver',
        element: <ProyectoList />,
      },
      {
        path: '/proyectos/modificar/:id',
        element: <ModificarProyecto />,
      },
      {
        path: '/proyectos/modificar/',
        element: <ModificarProyecto />,
      },
      {
        path: '/proyectos/agregar',
        element: <AgregarProyecto />,
      },
      {
        path: '/foro',
        element: <Foro />,
      },
      {
        path: '/foro/nuevo',
        element: <NuevoForo />,
      },
      {
        path: '/asistencia',
        element: <Asistencia />,
      },
      {
        path: '/usuarios',
        element: <UserManagement />,
      },
      {
        path: '/inventario',
        element: <Inventario />,
      },
      {
        path: '/inventario/material',
        element: <Material />,
      },
      {
        path: '/inventario/almacen',
        element: <Almacen />,
      },
      {
        path: '/inventario/registrar',
        element: <AddInventario />,
      },
      {
        path: '/inventario/editar/:id',
        element: <EditarInventario />,
      },
      {
        path: '/proyectos/inventario',
        element: <InventarioProyecto />,
      },
      {
        path: '/proyectos/inventario/registrar',
        element: <AddProyectoInventario />,
      },
      {
        path: '/proyectos/inventario/ver/:id',
        element: <VerInventarioProyecto />,
      },
      {
        path: '/inventario/almacen/editar/:id',
        element: <EditarAlmacen />,
      },
      {
        path: '/foro/mispublicaciones',
        element: <MisPublicaciones />,
      },
      {
        path: '/foro/editar/:id',
        element: <EditarMisPublicaciones />,
      },
      {
        path: '/inventario/material/editar/:id',
        element: <EditarMaterial />,
      },
      {
        path: '/proyectos/inventario/ver/:id/add',
        element: <MaddIP />,
      },
      {
        path: '/asignaciones',
        element: <AssignmentSystem />,
      },
      {
        path: '/lista-asignaciones',
        element: <AssignmentList />,
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />

  </React.StrictMode>
);