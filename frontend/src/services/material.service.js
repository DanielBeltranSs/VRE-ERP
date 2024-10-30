import axios from './root.service';
import { toast } from 'react-toastify';

// Obtener todos los materiales
export const getMaterial = async () => {
    try {
        const response = await axios.get('/material');
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error al obtener los materiales:', error);
        toast.error('Error al obtener los materiales');
        throw error; 
    }
};

// Obtener material por ID
export const getMaterialById = async (id) => {
  try {
    console.log('Realizando petición GET para material con ID:', id); // Confirmar solicitud
    const response = await axios.get(`/material/${id}`);
    console.log('Respuesta recibida de getMaterialById:', response.data); // Verificar datos recibidos
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
      console.error('Error al encontrar el material', error);
      alert('Error: ' + error.response?.data?.message);
  }
};

// Crear un nuevo material
export const createMaterial = async (material) => {
    try {
        const response = await axios.post('/material', material);
        if (response.status === 201) {
            toast.success('Material creado con éxito');
            return response.data;
        }
    } catch (error) {
        console.error('Error al crear material:', error);
        const errorMessage = error.response?.data?.message || 'Error al crear material';
        toast.error(errorMessage);
        throw error;
    }
};

// Actualizar un material existente
export const updateMaterial = async (id, material) => {
    try {
        const response = await axios.put(`/material/${id}`, material);
        if (response.status === 200) { // Ajustado a 200, asumiendo que PUT regresa 200
            toast.success('Material actualizado con éxito');
            return response.data;
        }
    } catch (error) {
        console.error('Error al editar el Material/Herramienta:', error);
        const errorMessage = error.response?.data?.message || 'Error desconocido al editar el material';
        toast.error(errorMessage);
        throw error;
    }
};

// Eliminar un material
export const deleteMaterial = async (id) => {
    try {
        const response = await axios.delete(`/material/${id}`);
        if (response.status === 200) { // Ajustado a 200 para DELETE
            toast.success('Material eliminado con éxito');
            return response.data;
        }
    } catch (error) {
        console.error('Error al eliminar material:', error);
        const errorMessage = error.response?.data?.message || 'Error al eliminar material';
        toast.error(errorMessage);
        throw error;
    }
};
