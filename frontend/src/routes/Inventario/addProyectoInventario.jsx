import { useState, useEffect } from 'react';
import { createInventarioProyecto } from './../../services/inventarioProyecto.service.js';
import { getProyectos } from '../../services/ProyectoService.js';
import { getInventario } from '../../services/inventario.service.js';
import { useNavigate } from 'react-router-dom';

const AddProyectoInventario = () => {
    const navigate = useNavigate();
    const [proyecto, setProyecto] = useState([]);
    const [inventarioMH, setInventarioMH] = useState([]);
    const [inventarioProyecto, setInventarioProyecto] = useState({
        proyecto: '',
        inventarios: [{ inventario: '', cantidadAsignada: 0 }],
    });

    useEffect(() => {
        fetchProyectoData();
        fetchInventarioData();
    }, []);

    const fetchProyectoData = async () => {
        try {
            const response = await getProyectos();
            setProyecto(response);
        } catch (error) {
            console.error('Error fetching proyecto data:', error);
        }
    };

    const fetchInventarioData = async () => {
        try {
            const response = await getInventario();
            setInventarioMH(response.data);
        } catch (error) {
            console.error('Error fetching inventario data:', error);
        }
    };

    const handleCriteriaChange = (index, name, value) => {
        const updatedInventario = [...inventarioProyecto.inventarios];
        updatedInventario[index][name] = value;
        setInventarioProyecto({ ...inventarioProyecto, inventarios: updatedInventario });
    };

    const handleAddCriteria = () => {
        setInventarioProyecto({
            ...inventarioProyecto,
            inventarios: [...inventarioProyecto.inventarios, { inventario: "", cantidadAsignada: 0 }],
        });
    };

    const handleRemoveCriteria = (index) => {
        const updatedInventario = [...inventarioProyecto.inventarios];
        updatedInventario.splice(index, 1);
        setInventarioProyecto({ ...inventarioProyecto, inventarios: updatedInventario });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInventarioProyecto({ ...inventarioProyecto, [name]: value });
    };

    const getAvailableInventario = (index) => {
        const selectedInventarios = inventarioProyecto.inventarios.map(i => i.inventario);
        return inventarioMH.filter(item => item._id === inventarioProyecto.inventarios[index].inventario || !selectedInventarios.includes(item._id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createInventarioProyecto(inventarioProyecto);
            alert('Inventario asignado con éxito');
            navigate('/proyectos/inventario');
            setInventarioProyecto({
                proyecto: '',
                inventarios: [{ inventario: '', cantidad: 0 }],
            });
        } catch (error) {
            console.error('Error al asignar el inventario:', error);
            alert('Hubo un error al asignar el inventario');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl text-center font-bold text-gray-900 mb-4">Registrar Inventario a Proyecto</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Proyecto</label>
                    <select
                        id='proyecto'
                        name='proyecto'
                        value={inventarioProyecto.proyecto}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700"
                    >
                        <option value=''>Seleccione una opción</option>
                        {proyecto.map((item) => (
                            <option key={item._id} value={item._id}>{item.titulo}</option>
                        ))}
                    </select>
                </div>

                <div className="text-gray-700">
                    <div className="flex justify-between mb-2">
                        <h3 className="text-sm font-semibold">Material o Herramienta</h3>
                        <h3 className="text-sm font-semibold">Cantidad</h3>
                        <button
                            type="button"
                            onClick={handleAddCriteria}
                            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-500"
                        >
                            <img className="w-5 h-5" src={`${import.meta.env.VITE_BASE_URL}/uploads/add.png`} alt="Agregar" />
                        </button>
                    </div>

                    {inventarioProyecto.inventarios.map((criteria, index) => (
                        <div key={index} className="flex items-center mb-3 space-x-4">
                            <span className="mr-1">{`${index + 1}:`}</span>
                            <select
                                id='inventario'
                                name='inventario'
                                value={criteria.inventario}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700"
                                onChange={(e) => handleCriteriaChange(index, "inventario", e.target.value)}
                            >
                                <option value=''>Seleccione una opción</option>
                                {getAvailableInventario(index).map((item) => (
                                    <option key={item._id} value={item._id}>{item.material.nombre} : {item.material.descripcion} : {item.cantidad} existencias</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                id='cantidadAsignada'
                                name='cantidadAsignada'
                                min={0}
                                value={criteria.cantidadAsignada}
                                onChange={(e) => handleCriteriaChange(index, "cantidadAsignada", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700"
                            />

                            <button
                                type="button"
                                onClick={() => handleRemoveCriteria(index)}
                                className="ml-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-500"
                            >
                                <img className="w-5 h-5" src={`${import.meta.env.VITE_BASE_URL}/uploads/eliminar.png`} alt="Eliminar" />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                >
                    Asignar
                </button>
            </form>
        </div>
    );
};

export default AddProyectoInventario;
