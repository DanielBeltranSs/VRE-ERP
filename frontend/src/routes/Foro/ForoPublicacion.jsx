import { useState } from 'react';
import { createForo } from './../../services/foro.service.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import UploadModal from './UploadModal.jsx';
import { toast } from 'react-toastify';

const NuevoForo = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [publicacion, setPublicacion] = useState({
        titulo: '',
        contenido: '',
        imagen: '',
        comentarios: [],
        autor: '',
        fechaCreacion: '',
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleFileUpload = (fileId) => {
        setPublicacion({ ...publicacion, imagen: fileId });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPublicacion({ ...publicacion, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newPublicacion = {
                titulo: publicacion.titulo,
                contenido: publicacion.contenido,
                imagen: publicacion.imagen,
                comentarios: [],
                autor: user.email,
            };

            await createForo(newPublicacion);
            toast.success('Publicación creada con éxito');
            navigate('/foro');
            setPublicacion({
                titulo: '',
                contenido: '',
                imagen: '',
                comentarios: [],
                autor: '',
            });
        } catch (error) {
            console.error('Error al crear la publicación:', error);
            toast.error('Hubo un error al crear la publicación');
        }
    };

    return (
        <div>
            <div className="">
                <div className='flex justify-between'>
                    <h1 className="text-2xl font-bold text-gray-900 ">Nueva Publicación</h1>
                    <button
                        onClick={openModal}
                        className='py-2 px-3 border border-transparent shadow-sm rounded-md bg-gray-700 hover:bg-gray-500'
                    >
                        <img className='w-5 h-5' src={`${import.meta.env.VITE_BASE_URL}/uploads/addphoto.png`} alt="Agregar Foto" />
                    </button>
                    <UploadModal isOpen={modalIsOpen} onClose={closeModal} onFileUpload={handleFileUpload} />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            id='titulo'
                            name='titulo'
                            value={publicacion.titulo}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700"
                            autoComplete='off'
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contenido</label>
                        <textarea
                            type="text"
                            id='contenido'
                            name='contenido'
                            value={publicacion.contenido}
                            onChange={handleInputChange}
                            className="mt-1 w-full h-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-300 text-gray-700"
                            autoComplete='off'
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Publicar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NuevoForo;
