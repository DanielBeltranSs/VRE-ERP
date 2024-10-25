import { useState, useEffect } from 'react';
import { updateForo, getForoById } from './../../services/foro.service.js';
import { useNavigate, useParams } from 'react-router-dom';
import UploadModal from './UploadModal.jsx';
import { toast } from 'react-toastify';

const EditarMisPublicaciones = () => {
    const { id } = useParams();
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

    useEffect(() => {
        if (id) {
            publicacionDataById(id);
        }
    }, [id]);

    const publicacionDataById = async (id) => {
        try {
            const response = await getForoById(id);
            if (response.data.imagen === null) {
                setPublicacion({
                    titulo: response.data.titulo,
                    contenido: response.data.contenido,
                    imagen: '',
                    comentarios: response.data.comentarios,
                    autor: response.data.autor,
                    fechaCreacion: response.data.fechaCreacion,
                });
            } else {
                setPublicacion({
                    titulo: response.data.titulo,
                    contenido: response.data.contenido,
                    imagen: response.data.imagen._id,
                    comentarios: response.data.comentarios,
                    autor: response.data.autor,
                    fechaCreacion: response.data.fechaCreacion,
                });
            }
        } catch (error) {
            console.error('Error al obtener la publicación:', error);
            alert('Hubo un error al obtener la publicación');
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleFileUpload = (fileId) => {
        setPublicacion({ 
            ...publicacion,
            imagen: fileId,
        });
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
                comentarios: publicacion.comentarios,
                autor: publicacion.autor,
                fechaCreacion: publicacion.fechaCreacion,
            };
            console.log(newPublicacion);
            await updateForo(id, newPublicacion);
            toast.success('Publicación editada con éxito');
            navigate('/foro/mispublicaciones');
            setPublicacion({
                titulo: '',
                contenido: '',
                imagen: '',
                comentarios: [],
                autor: '',
                fechaCreacion: '',
            });
        } catch (error) {
            console.error('Error al modificar la publicación:', error);
            toast.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Editar Publicación</h1>
                <button 
                    onClick={openModal} 
                    className="py-2 px-3 border border-transparent shadow-sm rounded-md bg-gray-500 hover:bg-gray-600 transition-colors"
                >
                    <img className="w-5 h-5" src={`${import.meta.env.VITE_BASE_URL}/uploads/addphoto.png`} alt="Subir imagen" />
                </button>
                <UploadModal isOpen={modalIsOpen} onClose={closeModal} onFileUpload={handleFileUpload} />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={publicacion.titulo}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete="off"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contenido</label>
                    <textarea
                        id="contenido"
                        name="contenido"
                        value={publicacion.contenido}
                        onChange={handleInputChange}
                        className="mt-1 block w-full h-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 focus:ring-gray-500 focus:border-gray-500"
                        autoComplete="off"
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                    Modificar
                </button>
            </form>
        </div>
    );
};

export default EditarMisPublicaciones;
