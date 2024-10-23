import { useState, useEffect } from 'react';
import { getInventarioProyectoById, deleteIndexInventarioProyecto } from './../../services/inventarioProyecto.service';
import { sumarInventario } from '../../services/inventario.service';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const VerInventarioProyecto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inventarioMH, setInventario] = useState([]);

    useEffect(() => {
        fetchInventarioData(id);
    }, []);

    const fetchInventarioData = async (id) => {
        try {
            const response = await getInventarioProyectoById(id);
            const data = response.data;
            setInventario(data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    const deleteInventarioRow = async (item) => {
        try {
            const { cantidadAsignada, inventario, _id } = item;
            const index = { cantidad: cantidadAsignada };
            await deleteIndexInventarioProyecto(id, { _id });
            await sumarInventario(inventario._id, index);
            fetchInventarioData(id);
        } catch (error) {
            console.error('Error deleting inventory row:', error);
        }
    };

    return (
        <div className='text-gray-700'>
            <div className="text-center mb-4 text-gray-800">
                <h2 className="text-lg font-bold">Inventario de {inventarioMH.proyecto?.titulo}</h2>
            </div>
            <div className='flex justify-between mb-3 text-xl'>
                <div></div>
                <div>
                    <button
                        onClick={() => navigate(`/proyectos/inventario/ver/${id}/add`)}
                        className='py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600'
                    >
                        Agregar Materiales
                    </button>
                </div>
            </div>
            <div>
                <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Nombre</th>
                                <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Descripción</th>
                                <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Cantidad</th>
                                <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Unidad de Medida</th>
                                <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Tipo</th>
                                <th className="w-1/5 py-4 px-6 text-left text-gray-600 font-bold uppercase">Almacén</th>
                                <th className="w-1/5 py-4 px-6 text-center text-gray-600 font-bold uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {inventarioMH.inventarios && inventarioMH.inventarios.length > 0 ? (
                                inventarioMH.inventarios.map((item) => (
                                    <tr key={item._id}>
                                        <td className="py-4 px-6 border-b border-gray-200">{item.inventario.material.nombre}</td>
                                        <td className="py-4 px-6 border-b border-gray-200">{item.inventario.material.descripcion}</td>
                                        <td className="py-4 px-6 border-b border-gray-200">{item.cantidadAsignada}</td>
                                        <td className="py-4 px-6 border-b border-gray-200">{item.inventario.material.unidad}</td>
                                        <td className="py-4 px-6 border-b border-gray-200">{item.inventario.material.tipo}</td>
                                        <td className="py-4 px-6 border-b border-gray-200">{item.inventario.almacen.nombre}</td>
                                        <td className="py-4 px-6 border-b border-gray-200 text-center">
                                            <button 
                                                onClick={() => deleteInventarioRow(item)} 
                                                className='bg-gray-600 hover:bg-gray-500 py-1 px-2 rounded-md'
                                            >
                                                <img className='w-5 h-5' src={`${import.meta.env.VITE_BASE_URL}/uploads/eliminar.png`} alt="Eliminar" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-4 px-6 text-center text-gray-500">
                                        No existe registro de inventarios asignado a proyectos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='p-4'>
                    <button
                        onClick={() => navigate('/proyectos/inventario')}
                        className="flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerInventarioProyecto;
