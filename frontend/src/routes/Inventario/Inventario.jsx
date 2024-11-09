import { useState, useEffect } from 'react';
import { getInventario, sumarInventario, restarInventario } from '../../services/inventario.service';
import { useNavigate } from 'react-router-dom';
import ModalAddCantidad from './ModalAddCantidad';

const Inventario = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [id, setId] = useState('');

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const openModal = (id) => {
        setModalIsOpen(true);
        setId(id);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        fetchInventoryData();
    };

    const fetchInventoryData = async () => {
        try {
            const response = await getInventario();
            const data = response.data;
            setInventory(data);
            setFilteredInventory(data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    const redireccionar = (ruta) => {
        navigate(ruta);
    };

    const formatearFecha = (fecha) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = inventory.filter(item =>
            item.material.nombre.toLowerCase().includes(value) ||
            (item.material.codigoBarra && item.material.codigoBarra.toLowerCase().includes(value))
        );
        setFilteredInventory(filtered);
    };

    const adjustCantidad = async (id, adjustment) => {
        try {
            const item = inventory.find(inv => inv._id === id);
            if (!item) return;

            // Definir el body para la solicitud
            const body = { cantidad: Math.abs(adjustment) }; // Enviar cantidad a ajustar

            if (adjustment > 0) {
                await sumarInventario(id, body);
            } else if (adjustment < 0 && item.cantidad + adjustment >= 0) { // Evita cantidad negativa
                await restarInventario(id, body);
            }

            fetchInventoryData(); // Refrescar la tabla
        } catch (error) {
            console.error('Error updating cantidad:', error);
        }
    };

    return (
        <div className="text-gray-700">
            <div className="text-center mb-4 text-gray-800">
                <h2 className="text-lg font-bold">Manejo de Inventario</h2>
            </div>
            <div className="flex flex-wrap justify-between mb-3 text-xl">
                <div className="mb-2 md:mb-0"><button onClick={() => redireccionar("/inventario/almacen")}>Almacen</button></div>
                <div className="mb-2 md:mb-0"><button onClick={() => redireccionar("/inventario/material")}>Materiales y Herramientas</button></div>
                <div className="mb-2 md:mb-0"><button onClick={() => redireccionar("/inventario/registrar")}>Registrar Inventario</button></div>
            </div>
            <div className="flex justify-start mx-4 md:mx-10 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Buscar por nombre o código de barras"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-gray-700 w-full md:w-1/3"
                />
            </div>
            <div className="shadow-lg rounded-lg overflow-x-auto mx-4 md:mx-10">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-xs md:text-sm">
                            <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Nombre</th>
                            <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Descripcion</th>
                            <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Cantidad</th>
                            <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Unidad de Medida</th>
                            <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Almacen</th>
                            <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Ingresado Por</th>
                            <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Fecha Ingreso</th>
                            <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-xs md:text-sm">
                        {filteredInventory && filteredInventory.length > 0 ? (
                            filteredInventory.map((item) => (
                                <tr key={item._id} className="border-b border-gray-200">
                                    <td className="py-2 md:py-4 px-2 md:px-6">{item.material.nombre}</td>
                                    <td className="py-2 md:py-4 px-2 md:px-6 truncate">{item.material.descripcion}</td>
                                    <td className="py-2 md:py-4 px-2 md:px-6 flex items-center">
                                        <button onClick={() => adjustCantidad(item._id, -1)} className="bg-gray-500 text-white px-2 py-1 rounded-l-md">
                                            -
                                        </button>
                                        <span className="px-3">{item.cantidad}</span>
                                        <button onClick={() => adjustCantidad(item._id, 1)} className="bg-gray-500 text-white px-2 py-1 rounded-r-md">
                                            +
                                        </button>
                                    </td>
                                    <td className="py-2 md:py-4 px-2 md:px-6">{item.material.unidad}</td>
                                    <td className="py-2 md:py-4 px-2 md:px-6">{item.almacen.nombre}</td>
                                    <td className="py-2 md:py-4 px-2 md:px-6">{item.usuarioIngreso}</td>
                                    <td className="py-2 md:py-4 px-2 md:px-6">{formatearFecha(item.fechaIngreso)}</td>
                                    <td className="py-2 md:py-4 px-2 md:px-6">
                                        <div className="flex space-x-2">
                                            <button onClick={() => navigate(`/inventario/editar/${item._id}`)} className="bg-gray-600 py-1 px-2 rounded-md">
                                                <img className="w-5 h-5" src={`${import.meta.env.VITE_BASE_URL}/uploads/editar.png`} alt="Editar" />
                                            </button>
                                            <button onClick={() => openModal(item._id)} className="bg-gray-600 py-1 px-2 rounded-md">
                                                <img className="w-5 h-5" src={`${import.meta.env.VITE_BASE_URL}/uploads/addrows2.png`} alt="Agregar" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="py-4 text-center">
                                    No existe registro de inventarios asignado a proyectos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalAddCantidad isOpen={modalIsOpen} onClose={closeModal} id={id} />
        </div>
    );
};

export default Inventario;
