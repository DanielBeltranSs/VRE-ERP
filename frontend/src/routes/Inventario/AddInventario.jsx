import { useState, useEffect } from 'react';
import { createInventario } from './../../services/inventario.service.js';
import { getAlmacen } from './../../services/almace.service.js';
import { getMaterial, getMaterialByBarcode } from './../../services/material.service.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddInventario = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [almacen, setAlmacen] = useState([]);
    const [material, setMaterial] = useState([]);
    const [barcode, setBarcode] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [inventario, setInventario] = useState({
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

    // Buscar material por código de barras
    const handleBarcodeSearch = async () => {
        if (!barcode.trim()) {
            toast.error("Por favor ingrese un código de barras.");
            return;
        }

        if (isSearching) return; // Evita múltiples llamadas

        setIsSearching(true);
        try {
            const foundMaterial = await getMaterialByBarcode(barcode);
            console.log('Material encontrado:', foundMaterial);

            if (foundMaterial && foundMaterial.data) {
                setInventario((prevState) => ({
                    ...prevState,
                    material: foundMaterial.data._id // Actualiza el dropdown con el ID del material encontrado
                }));
                toast.success("Material encontrado y seleccionado.");
            } else {
                toast.error('Material no encontrado con el código de barra proporcionado');
            }
        } catch (error) {
            console.error('Error fetching material by barcode:', error);
            toast.error('Material no encontrado con el código de barra proporcionado');
        } finally {
            setIsSearching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInventario({ ...inventario, [name]: value });
    };

    // Detecta "Enter" para ejecutar búsqueda automáticamente
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Previene el comportamiento por defecto
            handleBarcodeSearch(); // Llama a la función de búsqueda
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inventario.material) {
            toast.error("El material es obligatorio.");
            return;
        }

        try {
            const newInventario = {
                material: inventario.material,
                cantidad: inventario.cantidad,
                almacen: inventario.almacen,
                usuarioIngreso: user.email,
            };

            await createInventario(newInventario);
            toast.success('Inventario registrado con éxito');
            navigate('/inventario');
            setInventario({
                material: '',
                cantidad: 0,
                almacen: '',
                fechaIngreso: '',
            });
            setBarcode("");
        } catch (error) {
            console.error('Error al registrar el inventario:', error);
            toast.error('Hubo un error al registrar el inventario');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <ToastContainer />
            <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="mb-6 text-gray-800">
                    <h1 className="text-2xl font-bold text-center text-gray-900">Registrar Inventario</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Código de Barras</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                onKeyPress={handleKeyPress} // Detecta Enter para buscar
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm bg-gray-100 text-gray-700"
                            />
                            <button
                                type="button"
                                onClick={handleBarcodeSearch}
                                className="px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-r-md"
                                disabled={isSearching}
                            >
                                {isSearching ? "Buscando..." : "Buscar"}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Material o Herramienta</label>
                        <select
                            id="material"
                            name="material"
                            value={inventario.material}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700"
                        >
                            <option value="">Seleccione una opción</option>
                            {material.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.nombre} | Unidad: {item.unidad}
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Almacén</label>
                        <select
                            id="almacen"
                            name="almacen"
                            value={inventario.almacen}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700"
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
