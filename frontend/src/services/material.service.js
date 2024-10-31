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
        console.log('Realizando petición GET para material con ID:', id);
        const response = await axios.get(`/material/${id}`);
        console.log('Respuesta recibida de getMaterialById:', response.data);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error al encontrar el material', error);
        alert('Error: ' + error.response?.data?.message);
        throw error;
    }
};

// Obtener material por código de barras
// Servicio para obtener material por código de barras
export const getMaterialByBarcode = async (codigoBarra) => {
    try {
        const response = await axios.get(`/material/codigoBarra/${codigoBarra}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error al obtener material por código de barras:', error);
        throw error;
    }
  };
  
// Crear un nuevo material con imagen opcional
export const createMaterial = async (formData) => {
    try {
        const response = await axios.post('/material/uploadPhoto', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        toast.success('Material creado con éxito');
        return response.data;
    } catch (error) {
        console.error('Error al crear material:', error);
        const errorMessage = error.response?.data?.message || 'Error al crear material';
        toast.error(errorMessage);
        throw error;
    }
};

// Actualizar un material existente con imagen opcional
export const updateMaterial = async (id, formData) => {
    try {
        if (!formData.has("image") && !formData.has("imageUrl")) {
            formData.append("retainImage", true);
        }

        const response = await axios.put(`/material/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        if (response.status === 200) {
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
        if (response.status === 200) {
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
