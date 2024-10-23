import { useState, useEffect } from 'react';
import { getInventarioProyecto } from '../../services/inventarioProyecto.service';
import { useNavigate } from 'react-router-dom';

const InventarioProyecto = () => {
    const [inventory, setInventory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        try {
            const response = await getInventarioProyecto();
            const data = response.data;
            setInventory(data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    const redireccionar = (ruta) => {
        navigate(ruta);
    };

    return (
        <div className='text-gray-700'>
            <div className="text-center mb-4 text-gray-800">
                <h2 className="text-lg font-bold">Inventario de Proyecto</h2>
            </div>
            <div className='flex justify-end mb-3 text-xl'>
                <button 
                    onClick={() => redireccionar("/proyectos/inventario/registrar")}
                    className='py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 flex items-center'
                >
                    Crear Inventario
                </button>
            </div>
            <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="w-2/3 py-4 px-6 text-left text-gray-600 font-bold uppercase">Nombre Proyecto</th>
                            <th className="w-1/3 py-4 px-6 text-center text-gray-600 font-bold uppercase">Materiales Asignados</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {inventory && inventory.length > 0 ? (
                            inventory.filter(item => item.proyecto != null).map(item => (
                                <tr key={item._id}>
                                    <td className="py-4 px-6 border-b border-gray-200">{item.proyecto.titulo}</td>
                                    <td className="py-4 px-6 border-b border-gray-200 text-center">
                                        <button 
                                            onClick={() => navigate(`/proyectos/inventario/ver/${item._id}`)} 
                                            className="py-2 px-2 rounded-full bg-gray-700 hover:bg-gray-600"
                                        >
                                            <img className='w-5 h-5' src={`${import.meta.env.VITE_BASE_URL}/uploads/buscar.png`} alt="Ver Materiales" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="py-4 px-6 text-center text-gray-500">
                                    No existe registro de inventarios asignado a proyectos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className='p-4'>
                <button
                    onClick={() => navigate('/proyectos')}
                    className="flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-500"
                >
                    Volver
                </button>
            </div>
        </div>
    );
};

export default InventarioProyecto;
