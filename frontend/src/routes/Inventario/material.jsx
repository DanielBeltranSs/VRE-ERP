import { useEffect, useState } from "react";
import { getMaterial, deleteMaterial, getMaterialById, updateMaterial } from "../../services/material.service";
import ModalAddMaterial from "./ModalAddMaterial";
import ModalEditMaterial from "./ModalEditMaterial"; // Importa el modal de edición
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Material = () => {
    const [material, setMaterial] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null); // Almacena el material a editar

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
            setSelectedMaterial(materialData); // Configura el material seleccionado
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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este material?");
        if (confirmDelete) {
            try {
                await deleteMaterial(id);
                toast.success("Material eliminado con éxito");
                fetchMaterialData();
            } catch (error) {
                console.error("Error al eliminar material:", error);
                toast.error("Error al eliminar material");
            }
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
                    material={selectedMaterial} // Pasa el material seleccionado al modal
                />
            )}

            {/* Tabla para listar los materiales */}
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
                                                onClick={() => handleDelete(item._id)} 
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
