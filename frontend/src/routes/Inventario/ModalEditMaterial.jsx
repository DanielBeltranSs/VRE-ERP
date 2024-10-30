import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { updateMaterial } from '../../services/material.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalEditMaterial = ({ isOpen, onClose, material }) => {
    const [materialState, setMaterialState] = useState({
        nombre: '',
        descripcion: '',
        tipo: '',
        unidad: '',
        codigoBarra: '',
    });

    // Establecer los valores iniciales al recibir los datos de material
    useEffect(() => {
        if (material && material.data) {
            const { nombre, descripcion, tipo, unidad, codigoBarra } = material.data;
            setMaterialState({
                nombre: nombre || '',
                descripcion: descripcion || '',
                tipo: tipo || '',
                unidad: unidad || '',
                codigoBarra: codigoBarra || '', // Maneja el código de barras opcional
            });
        }
    }, [material]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMaterialState({ ...materialState, [name]: value });
    };

    // Evita el envío del formulario al presionar Enter en el campo de código de barras
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita que el Enter provoque el envío del formulario
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateMaterial(material.data._id, materialState);
            toast.success('Material modificado exitosamente');
            setTimeout(() => {
                onClose(); // Cierra el modal después de un retraso de 2 segundos
            }, 2000);        } catch (error) {
            console.error('Error al modificar el material:', error);
            toast.error(error.response?.data?.message || 'Hubo un error al modificar el material');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Formulario de Edición de Material/Herramienta"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-md p-5 w-full sm:w-2/3 md:w-1/3"
        >
            <ToastContainer />
            <div className="flex justify-between items-center mb-4 text-gray-800">
                <h2 className="text-lg font-bold">Editar Herramienta o Material</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={materialState.nombre}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700"
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <input
                        type="text"
                        id="descripcion"
                        name="descripcion"
                        value={materialState.descripcion}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700"
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Código de Barras (Opcional)</label>
                    <input
                        type="text"
                        id="codigoBarra"
                        name="codigoBarra"
                        value={materialState.codigoBarra}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress} // Evita el Enter en este campo
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700"
                        autoComplete="off"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                        <select
                            id="tipo"
                            name="tipo"
                            value={materialState.tipo}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700"
                            required
                        >
                            <option value="">Seleccionar tipo de material</option>
                            <option value="material">Material</option>
                            <option value="herramienta">Herramienta</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                        <select
                            id="unidad"
                            name="unidad"
                            value={materialState.unidad}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700"
                            required
                        >
                            <option value="">Seleccionar unidad de medida</option>
                            <option value="bolsa">Bolsa</option>
                            <option value="unidad">Unidad</option>
                            <option value="kg">Kilogramo</option>
                            <option value="litro">Litro</option>
                            <option value="caja">Caja</option>
                            <option value="metro">Metro</option>
                            <option value="rollo">Rollo</option>
                            <option value="galon">Galon</option>
                            <option value="pieza">Pieza</option>
                            <option value="docena">Docena</option>
                            <option value="paquete">Paquete</option>
                            <option value="saco">Saco</option>
                            <option value="barril">Barril</option>
                            <option value="tonelada">Tonelada</option>
                            <option value="otro">Metro cúbico</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
                    >
                        Salir
                    </button>
                    <button
                        type="submit"
                        className="bg-gray-700 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
                    >
                        Actualizar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalEditMaterial;
