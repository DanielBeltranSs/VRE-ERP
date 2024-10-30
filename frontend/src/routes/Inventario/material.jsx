import { useEffect, useState } from "react";
import { getMaterial, deleteMaterial } from "../../services/material.service";
import ModalAddMaterial from "./ModalAddMaterial";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Material = () => {
    const navigate = useNavigate();
    const [material, setMaterial] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetchMaterialData();
    }, []);

    const fetchMaterialData = async () => {
        try {
            const response = await getMaterial();
            const data = response.data;
            setMaterial(data);
        } catch (error) {
            console.error('Error fetching material data:', error);
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        fetchMaterialData();
    };

    const handleDelete = async (id) => {
        try {
            await deleteMaterial(id);
            toast.success("Material eliminado con éxito");
            fetchMaterialData();
        } catch (error) {
            console.error("Error al eliminar material:", error);
            toast.error("Error al eliminar material");
        }
    };

    return (
        <div className="text-gray-700 p-4">
            <ToastContainer />
            <div className="text-center mb-4 text-gray-800">
                <h2 className="text-lg font-bold">Herramientas y Materiales</h2>
            </div>

            <div className="flex justify-end mb-4">
                <button 
                    onClick={openModal} 
                    className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-all"
                >
                    Registrar Material
                </button>
            </div>

            <ModalAddMaterial isOpen={modalIsOpen} onClose={closeModal} />

            {/* Aquí hacemos la tabla desplazable en pantallas pequeñas */}
            <div className="shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Nombre</th>
                            <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Descripción</th>
                            <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Tipo</th>
                            <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Unidad de Medida</th>
                            <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {material && material.length > 0 ? (
                            material.map((item) => (
                                <tr key={item._id}>
                                    <td className="py-4 px-6 border-b border-gray-200">{item.nombre}</td>
                                    <td className="py-4 px-6 border-b border-gray-200">{item.descripcion}</td>
                                    <td className="py-4 px-6 border-b border-gray-200">{item.tipo}</td>
                                    <td className="py-4 px-6 border-b border-gray-200">{item.unidad}</td>
                                    <td className="py-4 px-6 border-b border-gray-200 text-center flex space-x-2">
                                        <button 
                                            onClick={() => navigate(`/inventario/material/editar/${item._id}`)} 
                                            className="bg-gray-600 hover:bg-gray-500 transition-all py-1 px-2 rounded-md flex justify-center items-center"
                                        >
                                            <img 
                                                className="w-5 h-5" 
                                                src={`${import.meta.env.VITE_BASE_URL}/uploads/editar.png`} 
                                                alt="Editar" 
                                            />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)} 
                                            className="bg-gray-600 hover:bg-gray-500 transition-all py-1 px-2 rounded-md flex justify-center items-center"
                                        >
                                            <img 
                                                className="w-5 h-5" 
                                                src={`${import.meta.env.VITE_BASE_URL}/uploads/eliminar.png`} 
                                                alt="Eliminar" 
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-600">
                                    No hay Materiales o Herramientas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Material;
