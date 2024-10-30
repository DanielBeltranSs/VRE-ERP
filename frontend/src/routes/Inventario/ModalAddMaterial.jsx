import { useState } from 'react';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createMaterial } from '../../services/material.service';

const ModalAddMaterial = ({ isOpen, onClose }) => {
    const [material, setMaterial] = useState({
        nombre: '',
        descripcion: '',
        tipo: '',
        unidad: '',
        codigoBarra: '',
        image: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMaterial({ ...material, [name]: value });
    };

    const handleFileChange = (e) => {
        setMaterial({ ...material, image: e.target.files[0] });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("nombre", material.nombre);
            formData.append("descripcion", material.descripcion);
            formData.append("tipo", material.tipo);
            formData.append("unidad", material.unidad);
            
            // Solo agregar el código de barras si tiene algún valor
            if (material.codigoBarra) {
                formData.append("codigoBarra", material.codigoBarra);
            }
            
            if (material.image) {
                formData.append("image", material.image);
            }
    
            await createMaterial(formData);
            toast.success('Material/Herramienta creado con éxito');
            setMaterial({
                nombre: '',
                descripcion: '',
                tipo: '',
                unidad: '',
                codigoBarra: '',
                image: null,
            });
            onClose();
        } catch (error) {
            console.error('Error al crear Material/Herramienta:', error);
            toast.error('Error al crear Material/Herramienta');
        }
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Formulario de Material/Herramienta"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-md p-5 w-full sm:w-2/3 md:w-1/3"
        >
            <ToastContainer />
            <div className="flex justify-between items-center mb-4 text-gray-800">
                <h2 className="text-lg font-bold">Registrar Nueva Herramienta o Material</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={material.nombre}
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
                        value={material.descripcion}
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
                        value={material.codigoBarra}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700"
                        autoComplete="off"
                    />
                </div>
                <div className='flex gap-4'>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                        <select
                            id='tipo'
                            name='tipo'
                            value={material.tipo}
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
                            id='unidad'
                            name='unidad'
                            value={material.unidad}
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Imagen (Opcional)</label>
                    <div className="relative">
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <button
                            type="button"
                            className="bg-gray-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-500"
                        >
                            Seleccionar archivo
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="bg-gray-700 hover:bg-gray-500 text-white py-2 px-4 rounded-md mr-2"
                    >
                        Registrar
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded-md text-white"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalAddMaterial;
