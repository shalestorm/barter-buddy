import React from "react";

const DeleteSkillModal = ({ isOpen, onClose, onConfirm, skill }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content del-skill-modal">
                <h2>Confirm Skill Deletion</h2>
                <p>Are you sure you want to delete the skill</p>
                <h4> <strong>"{skill.name}"</strong>?</h4>
                <div className="modal-buttons">
                    <button className="magic-button" onClick={() => onConfirm(skill.id)}>Yes, Delete</button>
                    <button className="magic-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSkillModal;
