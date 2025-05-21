import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const MessageSocketContext = createContext();

export const MessageSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return (
    <MessageSocketContext.Provider value={{ messages, sendMessage, socket: socketRef.current }}>
      {children}
    </MessageSocketContext.Provider>
  );
};

export const useMessageSocket = () => useContext(MessageSocketContext);
