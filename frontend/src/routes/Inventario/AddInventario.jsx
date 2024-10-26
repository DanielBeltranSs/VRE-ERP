import { useState, useEffect } from 'react';
import { createInventario } from './../../services/inventario.service.js';
import { getAlmacen } from './../../services/almace.service.js';
import { getMaterial } from './../../services/material.service.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const AddInventario = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [almacen, setAlmacen] = useState([]);
    const [material, setMaterial] = useState([]);
    const [inventario, setinventario] = useState({
        material: '',
        cantidad: 0,
        almacen: '',
        usuarioIngreso: '',
    });

    useEffect(() => {
        fetchAlmacenData();
        fetchMaterialData();
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setinventario({ ...inventario, [name]: value });
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

            await createInventario(newInventario);
            alert('Inventario Registrado con éxito');
            navigate('/inventario');
            setinventario({
                material: '',
                cantidad: 0,
                almacen: '',
                fechaIngreso: '',
            });
        } catch (error) {
            console.error('Error al registrar el inventario:', error);
            alert('Hubo un error al registrar el inventario');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="mb-6 text-gray-800">
                    <h1 className="text-2xl font-bold text-center text-gray-900">Registrar Inventario</h1>
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
                        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            min={0}
                            value={inventario.cantidad}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700"
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
                        className="flex justify-center py-2 px-4 w-full text-white font-medium bg-gray-600 hover:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Publicar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddInventario;
