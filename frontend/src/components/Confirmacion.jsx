import Modal from 'react-modal';

const ConfirmDialog = ({ show, handleClose, handleConfirm, title, message }) => {
  return (
    <Modal
      isOpen={show}
      onRequestClose={handleClose}
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      ariaHideApp={false}
    >
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg space-y-4 text-center">
        <div className="modal-header">
          <h5 className="text-lg font-semibold text-gray-900">{title}</h5>
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="modal-footer flex justify-center space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleConfirm}
          >
            Aceptar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
