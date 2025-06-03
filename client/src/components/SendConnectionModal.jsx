import React, { useState } from "react";


const SendConnectionModal = ({ isOpen, onClose, onSend }) => {
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async () => {
        await onSend(message);
        setMessage("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content send-con-modal">
                <h2>Send Connection Request</h2>
                <textarea
                    rows={4}
                    placeholder="Add an optional message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={255}
                    style={{ width: "300px", height: "150px", resize: "none" }}
                />
                <div className="modal-buttons">
                    <button className="magic-button" onClick={handleSubmit}>Send</button>
                    <button className="magic-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default SendConnectionModal;
