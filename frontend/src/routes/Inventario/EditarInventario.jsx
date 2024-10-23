import { useState, useEffect } from 'react';
import { getInventarioById, updateInventario } from './../../services/inventario.service.js';
import { getAlmacen } from './../../services/almace.service.js';
import { getMaterial } from './../../services/material.service.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const EditarInventario = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [almacen, setAlmacen] = useState([]);
    const [material, setMaterial] = useState([]);
    const [inventario, setInventario] = useState({
        material: '',
        cantidad: 0,
        almacen: '',
        usuarioIngreso: '',
    });
    const [inventarioSeleccionado, setInventarioSeleccionado] = useState([]);

    useEffect(() => {
        fetchAlmacenData();
        fetchMaterialData();
        if (id) {
            obtenerInventarioSeleccionado(id);
        }
    }, []);

    const fetchAlmacenData = async () => {
        try {
            const response = await getAlmacen();
            const data = response.data;
            setAlmacen(data);
        } catch (error) {
            console.error('Error fetching almacen data:', error);
        }
    };

    const fetchMaterialData = async () => {
        try {
            const response = await getMaterial();
            const data = response.data;
            setMaterial(data);
        } catch (error) {
            console.error('Error fetching material data:', error);
        }
    };

    const obtenerInventarioSeleccionado = async (inventarioId) => {
        try {
            const response = await getInventarioById(inventarioId);
            setInventarioSeleccionado(response.data);
            const newI = {
                material: response.data.material._id,
                cantidad: response.data.cantidad,
                almacen: response.data.almacen._id,
                usuarioIngreso: response.data.usuarioIngreso,
            };
            setInventario(newI);
        } catch (error) {
            console.error('Error al obtener los detalles del inventario', error);
            navigate('/inventario');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInventario({ ...inventario, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newInventario = {
                material: inventario.material,
                cantidad: inventario.cantidad,
                almacen: inventario.almacen,
                usuarioIngreso: user.email,
            };

            await updateInventario(id, newInventario);
            toast.success('Inventario modificado exitosamente');
            navigate('/inventario');
            setInventario({
                material: '',
                cantidad: 0,
                almacen: '',
                fechaIngreso: '',
            });
        } catch (error) {
            console.error('Error al modificar el inventario:', error);
            toast.error('Hubo un error al modificar el inventario');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="mb-6 text-gray-800">
                    <h1 className="text-2xl font-bold text-center text-gray-900">Editar Inventario</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Material o Herramienta</label>
                        <select
                            id="material"
                            name="material"
                            value={inventario.material}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700"
                        >
                            <option value="">Seleccione una opción</option>
                            {material.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.nombre} | Esta opción se cuantifica por: {item.unidad}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <p className="mt-1 min-h-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-gray-700">
                            {inventarioSeleccionado.material ? inventarioSeleccionado.material.descripcion : ''}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            min={0}
                            value={inventario.cantidad}
                            onChange={handleInputChange}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-300 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Almacén</label>
                        <select
                            id="almacen"
                            name="almacen"
                            value={inventario.almacen}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700"
                        >
                            <option value="">Seleccione una opción</option>
                            {almacen.map((almacen) => (
                                <option key={almacen._id} value={almacen._id}>
                                    {almacen.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Modificar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditarInventario;
