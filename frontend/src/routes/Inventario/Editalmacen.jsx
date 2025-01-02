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
            console.error('Error al obtener los detalles del almacén', error);
            toast.error('Hubo un error al obtener los detalles del almacén');
            navigate('/inventario/almacen');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAlmacen({ ...almacen, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        toast.info('Modificando el Almacén...');

        try {
            await updateAlmacen(id, almacen);
            toast.success('Almacén modificado exitosamente');
            navigate('/inventario/almacen');
            setAlmacen({
                nombre: '',
                ubicacion: '',
                fono: '',
            });
        } catch (error) {
            console.error('Error al modificar el almacén:', error);
            toast.error('Hubo un error al modificar el almacén');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
                <div className="mb-4 text-gray-800">
                    <h2 className="text-xl font-bold text-center">Editar Almacén</h2>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={almacen.nombre}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                        <input
                            type="text"
                            id="ubicacion"
                            name="ubicacion"
                            value={almacen.ubicacion}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            type="number"
                            id="fono"
                            name="fono"
                            value={almacen.fono}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none"
                        >
                            Modificar
                        </button>
                        <button
                            type="button"
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
