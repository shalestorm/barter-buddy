import React, { useState, useEffect } from 'react';
import { useMessageSocket } from '../hooks/useMessageSocket';
import MessageInput from './MessageInput';



const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!conversation) return;

    fetch(`/api/messages/${conversation.id}`)
      .then(res => res.json())
      .then(setMessages);
  }, [conversation]);

  useMessageSocket(conversation?.id, (newMsg) => {
    setMessages((prev) => [...prev, newMsg]);
  });

  if (!conversation) {
    return <div className="p-4 text-gray-500">Select a conversation to start messaging</div>;
  }

  return (
    <div className="chat-window flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.senderId === 'u1' ? 'text-right' : 'text-left'}`}>
            <div className="inline-block bg-gray-200 p-2 rounded">{msg.text}</div>
          </div>
        ))}
      </div>


<MessageInput conversationId={conversation.id} socket={socketInstance} />

    </div>
  );
};

export default ChatWindow;
