import React from "react";

const DeleteSkillModal = ({ isOpen, onClose, onConfirm, skill }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirm Skill Deletion</h3>
                <p>Are you sure you want to delete the skill <strong>"{skill.name}"</strong>?</p>
                <div className="modal-buttons">
                    <button className="magic-button" onClick={() => onConfirm(skill.id)}>Yes, Delete</button>
                    <button className="magic-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSkillModal;
