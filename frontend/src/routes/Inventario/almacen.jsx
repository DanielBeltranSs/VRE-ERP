import { useEffect, useState } from "react";
import { getAlmacen, deleteAlmacen } from "../../services/almace.service"; 
import ModalAlmacen from "./ModalAlmacen";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Almacen = () => {
    const navigate = useNavigate();
    const [almacen, setAlmacen] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [selectedAlmacenId, setSelectedAlmacenId] = useState(null);

    useEffect(() => {
        fetchAlmacenData();
    }, []);

    const fetchAlmacenData = async () => {
        try {
            const response = await getAlmacen();
            const data = response.data;
            setAlmacen(data);
        } catch (error) {
            console.error("Error fetching almacen data:", error);
            toast.error("Error al obtener los datos del almacen");
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        fetchAlmacenData();
    };

    const openDeleteModal = (id) => {
        setSelectedAlmacenId(id);
        setDeleteModalIsOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalIsOpen(false);
        setSelectedAlmacenId(null);
    };

    const handleDelete = async () => {
        if (selectedAlmacenId) {
            try {
                await deleteAlmacen(selectedAlmacenId);
                toast.success("Almacén eliminado exitosamente");
                fetchAlmacenData();
                closeDeleteModal();
            } catch (error) {
                console.error("Error al eliminar el almacén:", error);
                toast.error("Hubo un error al eliminar el almacén");
                closeDeleteModal();
            }
        }
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
            {deleteModalIsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">¿Estás seguro de que deseas eliminar este almacén?</h2>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeDeleteModal}
                                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md focus:outline-none"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md focus:outline-none"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div>
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
                                                <button
                                                    onClick={() => openDeleteModal(item._id)}
                                                    className="bg-gray-500 py-1 px-2 rounded-md"
                                                    title="Eliminar Almacen"
                                                >
                                                    <img className="w-5 h-5" src={`${import.meta.env.VITE_BASE_URL}/uploads/eliminar.png`} alt="Eliminar" />
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
