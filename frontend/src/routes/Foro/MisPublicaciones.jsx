import { useState, useEffect } from 'react';
import { getMisPublicaciones } from './../../services/foro.service.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const MisPublicaciones = () => {
    const { user } = useAuth();
    const [publicacion, setpublicacion] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [foroResponse] = await Promise.all([getMisPublicaciones(user.email)]);
            const reverseData = foroResponse.data.reverse(); 
            setpublicacion(reverseData);
        } catch (error) {
            console.error("Error al obtener datos", error);
            toast.error('Error al obtener datos');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatearFecha = (fecha) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    }

    const getPhotoUrl = (url) => {
        return url.startsWith('http') ? url : `${import.meta.env.VITE_BASE_URL}/${url}`;
    };

    const handlePhotoError = (e) => {
        e.target.src = `${import.meta.env.VITE_BASE_URL}/uploads/imagesNotFound.png`;
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="text-center mb-4 text-gray-800">
                <h2 className="text-lg font-bold">Mis publicaciones</h2>
            </div>
            <div className="flex justify-between p-4">
                <p></p>
                <button 
                    onClick={() => navigate("/foro/nuevo")} 
                    className="bg-gray-500 px-2 py-2 rounded-md flex items-center justify-center"
                >
                    <img className="w-5 h-5" src={`${import.meta.env.VITE_BASE_URL}/uploads/addpost.png`} alt="Nueva publicación" />
                </button>
            </div>
            
            <div className="bg-white">
                {publicacion.map((post) => (
                    <div key={post._id} className="px-4 py-4 mb-4 ring-4 ring-gray-300 rounded-lg shadow-sm bg-gray-50">
                        <div className="flex justify-between items-start">
                            <h2 className="font-bold text-xl mb-2 text-gray-900 uppercase flex-1">{post.titulo}</h2>
                            <button 
                                onClick={() => navigate(`/foro/editar/${post._id}`)} 
                                className="bg-gray-500 px-3 py-2 rounded-md"
                            >
                                <img className="w-5 h-5" src={`${import.meta.env.VITE_BASE_URL}/uploads/editar.png`} alt="Editar" />
                            </button>
                        </div>
                        
                        {post.imagen && (
                            <img 
                                src={getPhotoUrl(post.imagen.imageUrl)} 
                                alt="archivos"  
                                className="w-full max-w-lg max-h-lvh shadow-xl rounded-lg mx-auto mt-2"
                                onError={handlePhotoError}
                            />
                        )}
                        
                        <p className="text-gray-700 text-base text-justify mt-4 p-2">{post.contenido}</p>
                        
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-xs text-gray-600">{post.autor}</p>
                            <p className="text-xs text-gray-600">{formatearFecha(post.fechaCreacion)}</p>
                        </div>

                        {post.comentarios && post.comentarios.length > 0 && (
                            <p className="text-gray-700 mt-2">Comentarios:</p>
                        )}

                        {post.comentarios && post.comentarios.map((comentario) => (
                            <div key={comentario._id} className="bg-gray-50 p-4 mt-4 ring-1 ring-gray-400 rounded-sm">
                                <p className="text-gray-700 text-sm">{comentario.contenido}</p>
                                <div className="flex justify-between mt-2">
                                    <p className="text-xs text-gray-600">{comentario.usuario}</p>
                                    <p className="text-xs text-gray-600">{formatearFecha(comentario.fecha)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MisPublicaciones;
