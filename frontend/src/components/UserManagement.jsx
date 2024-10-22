import React, { useState, useEffect } from 'react';
import { getUsers, addUser, updateUser, deleteUser, uploadUserPhoto } from '../services/user.service';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ username: '', rut: '', password: '', email: '', roles: [] });
  const [editingUser, setEditingUser] = useState({ _id: '', username: '', rut: '', password: '', newPassword: '', email: '', roles: [] });
  const [enrollingUser, setEnrollingUser] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [editingPhotoFile, setEditingPhotoFile] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.rut && user.rut.toLowerCase().includes(value.toLowerCase()));
      setFilteredUsers(filtered);
    }
  };

  const handleAddUser = async () => {
    try {
      const createdUser = await addUser(newUser);
      if (photoFile) {
        const formData = new FormData();
        formData.append('rut', createdUser.rut);
        formData.append('photo', photoFile);
        await uploadUserPhoto(formData);
      }
      setNewUser({ username: '', rut: '', password: '', email: '', roles: [] });
      setPhotoFile(null);
      loadUsers();
      toast.success('Usuario agregado exitosamente');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error al agregar usuario');
    }
  };

  const handleEditUser = async () => {
    try {
      const { _id, username, rut, email, password, newPassword, roles } = editingUser;
      const userData = { username, rut, email, password, newPassword, roles };

      const response = await updateUser(_id, userData);
      if (editingPhotoFile) {
        const formData = new FormData();
        formData.append('rut', editingUser.rut);
        formData.append('photo', editingPhotoFile);
        await uploadUserPhoto(formData);
      }
      setEditingUser({ _id: '', username: '', rut: '', password: '', newPassword: '', email: '', roles: [] });
      setEditingPhotoFile(null);
      loadUsers();
      toast.success('Usuario editado exitosamente');
    } catch (error) {
      console.error('Error editing user:', error.response ? error.response.data : error.message);
      toast.error('Error al editar usuario');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      loadUsers();
      toast.success('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEnrollUser = async () => {
    setIsWaiting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/fingerprint/enroll`, { rut: enrollingUser.rut });
      toast.success('Huella digital registrada exitosamente');
    } catch (error) {
      console.error('Error al registrar la huella:', error);
      toast.error('Error al registrar la huella');
    } finally {
      setIsWaiting(false);
    }
  };

  const handleDeleteFingerprint = async () => {
    setIsWaiting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/fingerprint/delete`, { rut: enrollingUser.rut });
      toast.success('Huella digital eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la huella:', error);
      toast.error('Error al eliminar la huella');
    } finally {
      setIsWaiting(false);
    }
  };

  const renderFileInput = (setter) => (
    <label className="bg-blue-500 text-white p-2 rounded cursor-pointer custom-button">
      Seleccionar foto de perfil
      <input
        type="file"
        className="hidden"
        onChange={(e) => setter(e.target.files[0])}
      />
    </label>
  );

  return (
    <div className="user-management p-6 bg-white rounded shadow-md grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Agregar usuario */}
      <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-200">
              <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold uppercase">Agregar Usuario</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="py-4 px-6 border-b border-gray-200">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => handleInputChange(e, setNewUser)}
                  className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                />
                <input
                  type="text"
                  name="rut"
                  placeholder="RUT"
                  value={newUser.rut}
                  onChange={(e) => handleInputChange(e, setNewUser)}
                  className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => handleInputChange(e, setNewUser)}
                  className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => handleInputChange(e, setNewUser)}
                  className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                />
                <select
                  name="roles"
                  value={newUser.roles.length > 0 ? newUser.roles[0] : ""}
                  onChange={(e) => setNewUser({ ...newUser, roles: [e.target.value] })}
                  className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                >
                  <option value="">Seleccione un rol</option>
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex justify-center mt-2">
                  {renderFileInput(setPhotoFile)}
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={handleAddUser}
                    className="bg-blue-500 text-white p-2 rounded mt-2 block custom-button"
                  >
                    Registrar usuario
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lista de usuarios */}
      <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
  <table className="w-full table-fixed">
    <thead>
      <tr className="bg-gray-200">
        <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold uppercase">Lista de Usuarios</th>
      </tr>
    </thead>
    <tbody className="bg-white">
      <tr>
        <td className="py-4 px-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Buscar por RUT"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
          />
          <div className="overflow-y-auto h-64">
            <ul className="space-y-4">
              {filteredUsers.map(user => (
                <li key={user._id} className="p-2 border border-gray-300 rounded flex flex-col items-center justify-center space-y-2">
                  <div className="text-black text-center">
                    <span className="font-medium">{user.username}</span> - <span>{user.rut}</span>
                  </div>
                  <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4 justify-center">
                    <button 
                      onClick={() => setEditingUser({ ...user, password: '', newPassword: '' })} 
                      className="bg-yellow-500 text-white p-2 rounded custom-button w-full md:w-auto"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)} 
                      className="bg-red-500 text-white p-2 rounded custom-button w-full md:w-auto"
                    >
                      Eliminar
                    </button>
                    <button 
                      onClick={() => setEnrollingUser(user)} 
                      className="bg-green-500 text-white p-2 rounded custom-button w-full md:w-auto"
                    >
                      Enroll
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>


      {/* Editar Usuario */}
      {editingUser._id && (
        <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-200">
                <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold uppercase">Editar Usuario</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="py-4 px-6 border-b border-gray-200">
                  {editingUser.photoUrl && (
                    <div className="flex flex-col items-center mb-4">
                      <img src={`${import.meta.env.VITE_BASE_URL}${editingUser.photoUrl}`} alt="Foto del usuario" className="w-32 h-32 object-cover rounded-full mb-2" />
                      {renderFileInput(setEditingPhotoFile)}
                    </div>
                  )}
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={editingUser.username}
                    onChange={(e) => handleInputChange(e, setEditingUser)}
                    className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                  />
                  <input
                    type="text"
                    name="rut"
                    placeholder="RUT"
                    value={editingUser.rut}
                    onChange={(e) => handleInputChange(e, setEditingUser)}
                    className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={editingUser.password}
                    onChange={(e) => handleInputChange(e, setEditingUser)}
                    className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={editingUser.newPassword || ''}
                    onChange={(e) => handleInputChange(e, setEditingUser)}
                    className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={editingUser.email}
                    onChange={(e) => handleInputChange(e, setEditingUser)}
                    className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                  />
                  <select
                    name="roles"
                    value={editingUser.roles.length > 0 ? editingUser.roles[0] : ""}
                    onChange={(e) => setEditingUser({ ...editingUser, roles: [e.target.value] })}
                    className="p-2 border border-gray-300 rounded mb-2 w-full text-black bg-white"
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="text-center mt-4">
                    <button 
                      onClick={handleEditUser}
                      className="bg-green-500 text-white p-2 rounded custom-button"
                    >
                      Guardar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Enroll Huella */}
      {enrollingUser && (
        <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-200">
                <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Enroll Huella Digital</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="py-4 px-6 border-b border-gray-200 flex flex-col items-center">
                  <img src={`${import.meta.env.VITE_BASE_URL}${enrollingUser.photoUrl}`} alt="Foto del usuario" className="mb-4 w-32 h-32 object-cover rounded-full" />
                  <div className="bg-gray-200 p-4 rounded-lg text-black text-center mb-4 w-full">
                    <span className="font-medium">{enrollingUser.username}</span> - <span>{enrollingUser.rut}</span>
                  </div>
                  {isWaiting ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 rounded">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-t-4 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="mt-4 text-white">Por favor, ingrese su huella digital...</p>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleEnrollUser}
                        className="bg-blue-500 text-white p-2 rounded custom-button"
                      >
                        Registrar Huella
                      </button>
                      <button 
                        onClick={handleDeleteFingerprint}
                        className="bg-red-500 text-white p-2 rounded custom-button"
                      >
                        Eliminar Huella
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
