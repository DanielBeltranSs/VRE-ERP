import { useState, useEffect } from 'react';
import { getAlmacenById, updateAlmacen } from './../../services/almace.service.js';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditarAlmacen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [almacen, setAlmacen] = useState({
        nombre: '',
        ubicacion: '',
        fono: '',
    });
    
    const handleUpdate = (e) => {
        const shouldUpdate = window.confirm('¿Estás seguro de que deseas editar el Almacen?');

        if (shouldUpdate) {
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (id) {
            obtenerAlmacenSeleccionado(id);
        }
    }, [id]);

    const obtenerAlmacenSeleccionado = async (almacenId) => {
        try {
            const response = await getAlmacenById(almacenId);
            const newI = {
                nombre: response.data.nombre,
                ubicacion: response.data.ubicacion,
                fono: response.data.fono,
            };
            setAlmacen(newI);
        } catch (error) {
            console.error('Error al obtener los detalles del inventario', error);
            toast.error('Hubo un error al obtener los detalles del inventario');
            navigate('/inventario/almacen');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAlmacen({ ...almacen, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAlmacen(id, almacen);
            toast.success('Almacen modificado exitosamente');
            navigate('/inventario/almacen');
            setAlmacen({
                nombre: '',
                ubicacion: '',
                fono: '',
            });
        } catch (error) {
            console.error('Error al modificar el almacen:', error);
            toast.error('Hubo un error al modificar el almacen');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
                <div className="mb-4 text-gray-800">
                    <h2 className="text-xl font-bold text-center">Editar Almacen</h2>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            id='nombre'
                            name='nombre'
                            value={almacen.nombre}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                        <input
                            type="text"
                            id='ubicacion'
                            name='ubicacion'
                            value={almacen.ubicacion}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            type="number"
                            id='fono'
                            name='fono'
                            value={almacen.fono}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="bg-gray-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none"
                        >
                            Modificar
                        </button>
                        <button
                            onClick={() => navigate('/inventario/almacen')}
                            className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md focus:outline-none"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>                
            </div>
        </div>
    );
};

export default EditarAlmacen;
