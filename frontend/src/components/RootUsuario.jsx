import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { useState, useEffect } from 'react';

const RootUsuario = () => {
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        setUser(loggedUser);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="relative flex items-center pr-2 sm:pr-0 z-10">
            <div className="relative ml-3">
                <div>
                    <button
                        type="button"
                        className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        id="user-menu-button"
                        aria-expanded={isUserMenuOpen}
                        aria-haspopup="true"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img
                            className="h-12 w-12 rounded-full"  // Volvemos al tamaño fijo 12x12
                            src={user.photoUrl ? `${import.meta.env.VITE_BASE_URL}${user.photoUrl}` : `${import.meta.env.VITE_BASE_URL}/uploads/defaultphoto.png`}
                            alt="User avatar"
                        />
                    </button>
                </div>

                <div
                    className={`${
                        isUserMenuOpen ? 'block' : 'hidden'
                    } absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                >
                    <button
                        onClick={() => navigate('/foro/mispublicaciones')}
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-1"
                    >
                        Mis Publicaciones
                    </button>
                    <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-2"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RootUsuario;
