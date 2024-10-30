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
// Servicio actualizado para actualizar material con mejor manejo de `imageUrl`
export const updateMaterial = async (id, formData) => {
  try {
      // Comprueba si hay una imagen en el FormData
      if (!formData.has("image") && !formData.has("imageUrl")) {
          // Si no hay una nueva imagen y ya existe imageUrl, no envíes `imageUrl` para evitar que el backend lo sobrescriba
          formData.append("retainImage", true); // Envia un flag opcional
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
