import React, {useState, useEffect} from "react";
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'

const MessagesPage = () => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(Null);

    useEffect(() => {
        fetch('api/conversations')
            .then(res => res.json())
            .then(setConversations);
    }, []);

return (
    <div className="messages-page grid grid-cols-[300px_1fr] h-screen">
      <ConversationList
        conversations={conversations}
        onSelect={setActiveConversation}
      />
      <ChatWindow conversation={activeConversation} />
    </div>
  );
};

export default MessagesPage;
