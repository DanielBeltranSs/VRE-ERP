import React, { useState, useEffect } from 'react';
import { getAvailableParticipants } from '../services/assignment.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignmentEdit = ({ assignment, onClose, onUpdate }) => {
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [newParticipant, setNewParticipant] = useState('');

  useEffect(() => {
    setSelectedParticipants(assignment.Participantes);
    const fetchParticipants = async () => {
      try {
        const data = await getAvailableParticipants();
        setAvailableParticipants(data);
      } catch (err) {
        setError('Error al obtener los participantes disponibles');
      }
    };

    fetchParticipants();
  }, [assignment]);

  const handleAddParticipant = () => {
    if (newParticipant) {
      const selectedParticipantObject = availableParticipants.find(p => p._id === newParticipant);
      setSelectedParticipants([...selectedParticipants, selectedParticipantObject]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (participantId) => {
    setSelectedParticipants(selectedParticipants.filter(p => p._id !== participantId));
  };

  const handleUpdate = () => {
    const updatedAssignment = {
      ...assignment,
      Proyecto: assignment.Proyecto?._id?.toString() || '',
      Participantes: selectedParticipants.map(p => p._id),
    };
    onUpdate(updatedAssignment);
    toast.success('Se ha actualizado la asignación');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        <ToastContainer />
        <h2 className="text-xl font-bold text-black mb-4 text-center">Editar Asignación</h2>
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block text-black mb-2">Participantes Actuales:</label>
          <ul className="list-disc pl-5 mb-2 text-black space-y-1">
            {selectedParticipants.map(participant => (
              <li key={participant._id} className="flex justify-between items-center text-black">
                {participant.username}
                <button
                  className="bg-gray-500 p-1 rounded ml-2"
                  onClick={() => handleRemoveParticipant(participant._id)}
                >
                  <img src={`${import.meta.env.VITE_BASE_URL}/uploads/eliminar.png`} alt="Eliminar" className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
          <p className="text-black">Añadir Nuevos Participantes:</p>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
            <select
              className="border rounded p-2 flex-grow text-black bg-white"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
            >
              <option value="">Seleccione un participante</option>
              {availableParticipants
                .filter(p => !selectedParticipants.some(sp => sp._id === p._id))
                .map(participant => (
                  <option key={participant._id} value={participant._id}>
                    {participant.username}
                  </option>
              ))}
            </select>
            <button
              className="bg-gray-500 text-white p-2 rounded w-full md:w-auto"
              onClick={handleAddParticipant}
            >
              Añadir
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-500 text-white p-2 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button className="bg-gray-500 text-white p-2 rounded" onClick={handleUpdate}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentEdit;
