import React, { useEffect, useState } from 'react';
import { getProyectos, updateActividadEstado } from '../services/ProyectoService';
import { toast } from 'react-toastify';

const ProyectoList = () => {
  const [proyectos, setProyectos] = useState([]);
  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('fechaAsc');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProyectos();
        setProyectos(data);
        setFilteredProyectos(data);
      } catch (error) {
        setError(error.message);
        toast.error('Error al cargar los proyectos.');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    filterProyectos();
  }, [searchTerm, sortOrder, proyectos]);

  const formateoFechas = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filterProyectos = () => {
    let filtered = proyectos.filter(proyecto =>
      proyecto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOrder) {
      case 'fechaAsc':
        filtered.sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));
        break;
      case 'fechaDesc':
        filtered.sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio));
        break;
      case 'tituloAsc':
        filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'tituloDesc':
        filtered.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case 'presupuestoAsc':
        filtered.sort((a, b) => a.presupuesto - b.presupuesto);
        break;
      case 'presupuestoDesc':
        filtered.sort((a, b) => b.presupuesto - a.presupuesto);
        break;
      default:
        break;
    }

    setFilteredProyectos(filtered);
  };

  const handleEstadoChange = async (proyectoId, actividadIndex, newEstado) => {
    try {
      await updateActividadEstado(proyectoId, actividadIndex, newEstado);

      const updatedProyectos = proyectos.map((proyecto) => {
        if (proyecto._id === proyectoId) {
          const updatedActividades = proyecto.actividades.map((actividad, index) =>
            index === actividadIndex ? { ...actividad, estado: newEstado } : actividad
          );
          return { ...proyecto, actividades: updatedActividades };
        }
        return proyecto;
      });

      setProyectos(updatedProyectos);
      setFilteredProyectos(updatedProyectos);
      toast.success('Estado de actividad actualizado');
    } catch (error) {
      console.error('Error al actualizar el estado de la actividad', error);
      toast.error('Error al actualizar el estado de la actividad');
    }
  };

  const calculateProgress = (actividades) => {
    const total = actividades.length;
    const completed = actividades.filter(actividad => actividad.estado).length;
    return (completed / total) * 100;
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!Array.isArray(proyectos)) {
    return <div className="text-gray-500">No hay proyectos disponibles.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Lista de Proyectos</h2>
      <div className="mb-6 flex flex-wrap items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-gray-700 w-full sm:w-auto"
        />
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-gray-700 w-full sm:w-auto"
        >
          <option value="fechaAsc">Fecha de inicio ascendente</option>
          <option value="fechaDesc">Fecha de inicio descendente</option>
          <option value="tituloAsc">Título ascendente</option>
          <option value="tituloDesc">Título descendente</option>
          <option value="presupuestoAsc">Presupuesto menor a mayor</option>
          <option value="presupuestoDesc">Presupuesto mayor a menor</option>
        </select>
      </div>
      <ul className="space-y-6">
        {filteredProyectos.map((proyecto) => (
          <li key={proyecto._id} className="p-4 sm:p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center sm:text-left">{proyecto.titulo}</h3>
            <p className="text-gray-700 mb-2"><strong>Descripción:</strong> {proyecto.descripcion}</p>
            <p className="text-gray-700 mb-2"><strong>Empresa Licitante:</strong> {proyecto.empresa_licitante}</p>
            <p className="text-gray-700 mb-2"><strong>Fecha de Inicio:</strong> {proyecto.fecha_inicio}</p>
            <p className="text-gray-700 mb-2"><strong>Fecha de Término:</strong> {proyecto.fecha_termino}</p>
            <p className="text-gray-700 mb-4"><strong>Presupuesto:</strong> ${proyecto.presupuesto}</p>
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Actividades:</h4>
              <ul className="list-disc pl-5 space-y-2">
                {proyecto.actividades.map((actividad, index) => (
                  <li key={index} className="bg-gray-50 p-3 rounded-md shadow-sm">
                    <p className="text-gray-700"><strong>Nombre:</strong> {actividad.nombre}</p>
                    <p className="text-gray-700"><strong>Descripción:</strong> {actividad.descripcion}</p>
                    <p className="text-gray-700"><strong>Fecha de Inicio:</strong> {formateoFechas(actividad.fecha_inicio)}</p>
                    <p className="text-gray-700"><strong>Fecha de Término:</strong> {formateoFechas(actividad.fecha_termino)}</p>
                    <p className="text-gray-700"><strong>Responsable:</strong> {actividad.responsable}</p>
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2"><strong>Estado:</strong></span>
                      <select
                        value={actividad.estado ? 'completado' : 'no completado'}
                        onChange={(e) => handleEstadoChange(proyecto._id, index, e.target.value === 'completado')}
                        className="p-1 border border-gray-300 rounded-md bg-gray-200 text-gray-700 w-full sm:w-auto"
                      >
                        <option value="no completado">No completado</option>
                        <option value="completado">Completado</option>
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                        Progreso
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {calculateProgress(proyecto.actividades).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${calculateProgress(proyecto.actividades)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-600"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProyectoList;
