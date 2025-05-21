import React, { useState, useEffect, useRef } from 'react';

const MessageInput = ({ conversationId, socket }) => {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversationId]);

  const handleSend = () => {
    if (!text.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    const message = {
      conversationId,
      text,
      timestamp: new Date().toISOString(),
      senderId: 'UID1', //need to put actual logged-in user ID
    };

    socket.send(JSON.stringify(message));
    setText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-2">
      <textarea
        ref={inputRef}
        className="w-full p-2 border rounded resize-none"
        rows={2}
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
