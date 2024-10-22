import { useNavigate } from 'react-router-dom'; 
import { getProyectos } from '../services/ProyectoService';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPublicaciones();
  }, []);

  const obtenerPublicaciones = async () => {
    try {
      const data = await getProyectos();
      if (data) {
        setProyectos(data);
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast.error('Error al cargar los proyectos.');
    }
  };

  const buttonStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer custom-button";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
       <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden p-4 sm:p-8">
        <div className="shadow-lg rounded-lg overflow-hidden">
          
          {/* Cambiar a 'block' en pantallas pequeñas para que se apilen */}
          <table className="w-full table-auto sm:table-fixed">
          <thead>
                <tr className="bg-gray-200">
                  <th className="w-full py-4 px-6 text-left justify-center items-center text-gray-600 font-bold uppercase">Proyectos</th>
                  <th className="hidden sm:table-cell w-full py-4 px-6 text-center text-gray-600 font-bold uppercase"></th>
                </tr>
              </thead>
            <tbody className="bg-white ">
              {/* Cada fila debería ser un bloque en pantallas pequeñas */}
              <tr className="block sm:table-row">
                <td className="py-4 px-6 border-b border-gray-200 w-full">
                  <div className="group relative border rounded transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 bg-gray-100">
                    <div className="relative py-8 p-4 sm:p-8">
                      <div className="flex flex-col items-center space-y-4">
                        <button 
                          className={buttonStyle}
                          onClick={() => navigate('/proyectos/ver')}
                        >
                          Ver Proyectos
                        </button>
                        <p className="text-gray-600 text-center">Accede a una vista detallada de todos los proyectos disponibles. Puedes revisar el estado, los plazos y la información de cada proyecto en curso.</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-gray-200 block sm:table-cell">
                  <div className="group relative border rounded transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 bg-gray-100">
                    <div className="relative py-8 p-4 sm:p-8">
                      <div className="flex flex-col items-center space-y-4">
                        <button 
                          className={buttonStyle}
                          onClick={() => navigate('/proyectos/agregar')}
                        >
                          Agregar Proyecto
                        </button>
                        <p className="text-gray-600 text-center">Crea un nuevo proyecto con la información requerida como el título, la descripción, la empresa licitante, fechas y actividades.</p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="block sm:table-row">
                <td className="py-4 px-6 border-b border-gray-200 block sm:table-cell">
                  <div className="group relative border rounded transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 bg-gray-100">
                    <div className="relative py-8 p-4 sm:p-8">
                      <div className="flex flex-col items-center space-y-4">
                        <button 
                          className={buttonStyle}
                          onClick={() => navigate('/proyectos/modificar')}
                        >
                          Modificar Proyecto
                        </button>
                        <p className="text-gray-600 text-center">Realiza modificaciones a proyectos existentes. Puedes actualizar la información del proyecto, añadir nuevas actividades, cambiar responsables y ajustar plazos según sea necesario.</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-gray-200 block sm:table-cell">
                  <div className="group relative border rounded transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 bg-gray-100">
                    <div className="relative py-8 p-4 sm:p-8">
                      <div className="flex flex-col items-center space-y-4">
                        <button 
                          className={buttonStyle}
                          onClick={() => navigate('/proyectos/inventario')}
                        >
                          Asignar Inventario
                        </button>
                        <p className="text-gray-600 text-center">Administra y asigna inventarios específicos a cada proyecto. Permite gestionar el material y los recursos necesarios para la ejecución de los proyectos.</p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="block sm:table-row">
                <td className="py-4 px-6 border-b border-gray-200 block sm:table-cell">
                  <div className="group relative border rounded transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 bg-gray-100">
                    <div className="relative py-8 p-4 sm:p-8">
                      <div className="flex flex-col items-center space-y-4">
                        <button
                          className={buttonStyle}
                          onClick={() => navigate('/asignaciones')}
                        >
                          Gestionar Personal
                        </button>
                        <p className="text-gray-600 text-center">Gestiona el personal asignado a los proyectos. Puedes verificar disponibilidad, asignar y liberar colaboradores a proyectos.</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 border-b border-gray-200 block sm:hidden"></td> {/* Oculto en pantallas pequeñas */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Proyectos;
