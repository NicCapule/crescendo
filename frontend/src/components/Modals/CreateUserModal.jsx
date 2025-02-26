import React from "react";
import Modal from "react-modal";

function CreateUserModal({ isOpen, onClose }) {
  Modal.setAppElement("#root");
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Create User Modal"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            width: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <h2>Create User</h2>
        <p>Fill in the user details here.</p>
        <button onClick={onClose}>Close</button>
      </Modal>
    </div>
  );
}

export default CreateUserModal;
