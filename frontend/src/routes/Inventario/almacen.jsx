import { useEffect, useState } from "react";
import { getAlmacen } from "../../services/almace.service";
import ModalAlmacen from "./ModalAlmacen";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Almacen = () => {
    const navigate = useNavigate();
    const [almacen, setAlmacen] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetchAlmacenData();
    }, []);

    const fetchAlmacenData = async () => {
        try {
            const response = await getAlmacen();
            const data = response.data;
            setAlmacen(data);
        } catch (error) {
            console.error('Error fetching almacen data:', error);
            toast.error('Error al obtener los datos del almacen');
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        fetchAlmacenData();
    };

    return (
        <div className="text-gray-700">
            <div className="text-center mb-4 text-gray-800">
                <h2 className="text-lg font-bold">Almacenes Registrados</h2>
            </div>
            <div className="p-2 flex justify-between">
                <div></div>
                <button 
                    onClick={openModal} 
                    className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500"
                >
                    Agregar Almacen
                </button>
            </div>
            <ModalAlmacen isOpen={modalIsOpen} onClose={closeModal} />
            <div>
                {/* Añadimos overflow-x-auto para la tabla en pantallas pequeñas */}
                <div className="shadow-lg rounded-lg overflow-x-auto mx-4 md:mx-10">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-xs md:text-sm">
                                <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Nombre</th>
                                <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Ubicación</th>
                                <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Fono</th>
                                <th className="w-1/4 py-2 md:py-4 px-2 md:px-6 text-left text-gray-600 font-bold uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-xs md:text-sm">
                            {almacen && almacen.length > 0 ? (
                                almacen.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200">
                                        <td className="py-2 md:py-4 px-2 md:px-6">{item.nombre}</td>
                                        <td className="py-2 md:py-4 px-2 md:px-6 truncate">{item.ubicacion}</td>
                                        <td className="py-2 md:py-4 px-2 md:px-6">{item.fono}</td>
                                        <td className="py-2 md:py-4 px-2 md:px-6">
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => navigate(`/inventario/almacen/editar/${item._id}`)} 
                                                    className="bg-gray-500 py-1 px-2 rounded-md" 
                                                    title="Editar Almacen"
                                                >
                                                    <img className="w-5 h-5" src={`${import.meta.env.VITE_BASE_URL}/uploads/editar.png`} alt="Editar" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center font-semibold text-gray-600">
                                        No existe Almacen. Registre un Almacen para el Inventario.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Almacen;
