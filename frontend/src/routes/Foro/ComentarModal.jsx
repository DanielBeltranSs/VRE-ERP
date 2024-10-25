import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from 'react-modal';
import { comentar } from '../../services/foro.service';
import { toast } from 'react-toastify';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        maxWidth: '90%',
        width: '400px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        backgroundColor: 'white',
        zIndex: 9999, // Asegurarse de que el modal esté en la parte superior
    },
    overlay: {
        zIndex: 9999, // Asegurar que el fondo del modal también esté por encima de otros elementos
    }
};

const ComentarModal = ({ isOpen, onClose, id }) => {
    const { user } = useAuth();
    const [comentario, setComentar] = useState({
        usuario: user.email,
        contenido: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setComentar({ ...comentario, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newComentario = {
                usuario: user.email,
                contenido: comentario.contenido,
            };
            await comentar(id, newComentario);
            toast.success('Comentario agregado con éxito');
            onClose();
            setComentar({
                usuario: '',
                contenido: '',
            });
        } catch (error) {
            console.error('Error al comentar Publicación:', error);
            toast.error('Error al Comentar Publicación');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Comentar Publicación"
            style={customStyles}
        >
            <div className="flex justify-between items-center mb-4 text-gray-800">
                <h2 className="text-lg font-bold">Agregar Comentario</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        id='contenido'
                        name='contenido'
                        value={comentario.contenido}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete='off'
                        placeholder="Escribe tu comentario aquí..."
                    />
                </div>
                <div className="flex justify-center space-x-2">
                    <button
                        type="submit"
                        className="bg-gray-700 hover:bg-gray-500 text-white py-2 px-4 rounded-md flex items-center justify-center"
                    >
                        <img className="w-5 h-5 mr-1" src={`${import.meta.env.VITE_BASE_URL}/uploads/addcomentar.png`} alt="Comentar" />
                        Comentar
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-700 hover:bg-gray-500 text-white py-2 px-4 rounded-md flex items-center justify-center"
                    >
                        <img className="w-5 h-5 mr-1" src={`${import.meta.env.VITE_BASE_URL}/uploads/circlecancel.png`} alt="Cancelar" />
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ComentarModal;
