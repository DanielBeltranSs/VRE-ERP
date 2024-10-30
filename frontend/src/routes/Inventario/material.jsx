import { useEffect, useState } from "react";
import { getMaterial, deleteMaterial, getMaterialById } from "../../services/material.service";
import ModalAddMaterial from "./ModalAddMaterial";
import ModalEditMaterial from "./ModalEditMaterial"; 
import Modal from 'react-modal'; // Importa Modal para el modal de confirmación
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Material = () => {
    const [material, setMaterial] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [materialToDelete, setMaterialToDelete] = useState(null); // Almacena el material a eliminar

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
            toast.error("Error al cargar los materiales");
        }
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        fetchMaterialData();
    };

    const openEditModal = async (id) => {
        try {
            const materialData = await getMaterialById(id);
            setSelectedMaterial(materialData);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Error al obtener el material:', error);
            toast.error("Error al obtener los detalles del material");
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedMaterial(null);
        fetchMaterialData();
    };

    const openDeleteModal = (id) => {
        setMaterialToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setMaterialToDelete(null);
    };

    const confirmDelete = async () => {
        if (materialToDelete) {
            try {
                await deleteMaterial(materialToDelete);
                toast.success("Material eliminado con éxito");
                fetchMaterialData();
            } catch (error) {
                console.error("Error al eliminar material:", error);
                toast.error("Error al eliminar material");
            }
            closeDeleteModal();
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
                    onClick={openAddModal} 
                    className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-all"
                >
                    Registrar Material
                </button>
            </div>

            <ModalAddMaterial isOpen={isAddModalOpen} onClose={closeAddModal} />
            {selectedMaterial && (
                <ModalEditMaterial
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    material={selectedMaterial}
                />
            )}

            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                contentLabel="Confirmación de Eliminación"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-md p-5 w-full sm:w-1/2 md:w-1/3"
            >
                <h3 className="text-lg font-bold text-gray-900 mb-4">¿Estás seguro de que deseas eliminar este material?</h3>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={closeDeleteModal}
                        className="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={confirmDelete}
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
                    >
                        Eliminar
                    </button>
                </div>
            </Modal>

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
                                    <td className="py-4 px-6 border-b border-gray-200 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button 
                                                onClick={() => openEditModal(item._id)} 
                                                className="bg-gray-600 hover:bg-gray-500 transition-all py-1 px-2 rounded-md"
                                            >
                                                <img 
                                                    className="w-5 h-5" 
                                                    src={`${import.meta.env.VITE_BASE_URL}/uploads/editar.png`} 
                                                    alt="Editar" 
                                                />
                                            </button>
                                            <button 
                                                onClick={() => openDeleteModal(item._id)} 
                                                className="bg-gray-600 hover:bg-gray-500 transition-all py-1 px-2 rounded-md"
                                            >
                                                <img 
                                                    className="w-5 h-5" 
                                                    src={`${import.meta.env.VITE_BASE_URL}/uploads/eliminar.png`} 
                                                    alt="Eliminar" 
                                                />
                                            </button>
                                        </div>
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
