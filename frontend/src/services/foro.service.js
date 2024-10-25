import axios from './root.service';

export const getForo = async () => {
    try {
      const response = await axios.get('/foro');
      if (response.status === 200) { 
        return response.data; 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener las publicaciones';
      console.error('Error al obtener las publicaciones', error);
      throw errorMessage;
    }
};

export const getForoById = async (id) => {
    try {
      const response = await axios.get(`/foro/${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener la publicación';
      console.error('Error al obtener la publicación', error);
      throw errorMessage;
    }
};

export const createForo = async (publicacion) => {
    try {
      console.log(publicacion);
      const response = await axios.post('/foro', publicacion);
      console.log(response);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al crear la publicación';
      console.error('Error al crear la publicación', error);
      throw errorMessage;
    }
};

export const updateForo = async (id, publicacion) => {
    try {
      const response = await axios.put(`/foro/${id}`, publicacion);
      console.log(response);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al actualizar la publicación';
      console.error('Error al actualizar la publicación', error);
      throw errorMessage;
    }
};

export const deleteForo = async (id) => {
    try {
      const response = await axios.delete(`/foro/${id}`);
  
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar la publicación';
      console.error('Error al eliminar la publicación', error);
      throw errorMessage;
    }
};

// Nuevo servicio para eliminar comentarios
export const deleteComentario = async (idPublicacion, idComentario) => {
  try {
      const response = await axios.delete(`/foro/${idPublicacion}/comentario/${idComentario}`);
      if (response.status === 200) {
          return response.data;
      }
  } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar el comentario';
      console.error('Error al eliminar el comentario', error);
      throw errorMessage;
  }
};


export const comentar = async (id, comentario) => {
    try {
      const response = await axios.put(`/foro/comentar/${id}`, comentario);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al comentar la publicación';
      console.error('Error al comentar la publicación', error);
      throw errorMessage;
    }
};

export const getMisPublicaciones = async (author) => {
    try {
      console.log(author);
      const response = await axios.get(`/foro/mispublicaciones/${author}`);
      console.log(response);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error desconocido al obtener las publicaciones';
      console.error('Error al obtener las publicaciones', error);
      throw errorMessage;
    }
};
