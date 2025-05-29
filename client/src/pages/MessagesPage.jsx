import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import '../pages/MessagesPage.css'

export default function MessagesPage() {
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const { user: currentUser } = useAuth();

  const API_BASE = "http://localhost:8000";

  // Fetch connections, requests, and user details
  useEffect(() => {
    let connectionsData = [];
    let requestsData = [];

    const fetchConnections = fetch(`${API_BASE}/connections/user/${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        connectionsData = data;
        setConnections(data);
      });

    const fetchRequests = fetch(`${API_BASE}/connection_requests/received/${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        requestsData = data;
        setRequests(data);
      });

    Promise.all([fetchConnections, fetchRequests])
      .then(() => {
        // Get all unique user IDs from connections and requests
        const connectionUserIds = connectionsData.map(con =>
          con.user_a_id === currentUser.id ? con.user_b_id : con.user_a_id
        );
        const requestSenderIds = requestsData.map(req => req.sender_id);

        const allUserIds = [...new Set([...connectionUserIds, ...requestSenderIds])];

        // Fetch all user details
        return Promise.all(
          allUserIds.map(id =>
            fetch(`${API_BASE}/users/${id}`).then(res => res.json())
          )
        );
      })
      .then(userDataArray => {
        const userMap = {};
        userDataArray.forEach(user => {
          userMap[user.id] = user;
        });
        setUserDetails(userMap);
      })
      .catch(console.error);
  }, [currentUser.id]);

  // Fetch messages for selected connection
  useEffect(() => {
    if (selectedConnection) {
      fetch(`${API_BASE}/messages/connection/${selectedConnection.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to find messages");
          return res.json();
        })
        .then(setMessages)
        .catch(console.error);
    }
  }, [selectedConnection]);

  const getOtherUserId = (con) => {
    return con.user_a_id === currentUser.id ? con.user_b_id : con.user_a_id;
  };

  const handleSend = () => {
    if (!messageText.trim() || !selectedConnection) return;

    fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender_id: currentUser.id,
        receiver_id: getOtherUserId(selectedConnection),
        connection_id: selectedConnection.id,
        content: messageText.trim()
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Could not send message");
        return res.json();
      })
      .then(newMsg => {
        setMessages(prev => [...prev, newMsg]);
        setMessageText("");
      })
      .catch(console.error);
  };

  const handleAcceptRequest = (req) => {
    fetch(`${API_BASE}/connections`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        user_a_id: req.sender_id,
        user_b_id: req.receiver_id,
        is_active: true,
      }),
    })
      .then(res => res.json())
      .then((newConnection) => {
        // After making the connection, delete the original request
        return fetch(`${API_BASE}/connection_requests/${req.id}`, {
          method: "DELETE"
        }).then(() => newConnection);
      })
      .then((newConnection) => {
        setConnections(prev => [newConnection, ...prev]);
        setRequests(prev => prev.filter(r => r.id !== req.id));
        setSelectedRequest(null);
      })
      .catch(console.error);
  };

  const handleDenyRequest = (req) => {
    fetch(`${API_BASE}/connection_requests/${req.id}`, {
      method: "DELETE"
    })
      .then(() => {
        setRequests(prev => prev.filter(r => r.id !== req.id));
        setSelectedRequest(null);
      })
      .catch(console.error);
  };

  return (
    <><Header /><div className="chat-page">
      <aside className="chat-list">
        <h3>Connection Requests</h3>
        {requests.length === 0 ? (
          <p>nobody wants to be your buddy</p>
        ) : (
          requests.map(req => (
            <div
              key={`req-${req.id}`}
              className="request-card"
              onClick={() => {
                setSelectedRequest(req);
                setSelectedConnection(null);
              }}
            >
              <p>
                Request from{" "}
                {userDetails[req.sender_id]
                  ? `${userDetails[req.sender_id].first_name} ${userDetails[req.sender_id].last_name}`
                  : "unknown user"}
              </p>
              <button onClick={() => handleAcceptRequest(req)}>Accept</button>
              <button onClick={() => handleDenyRequest(req)}>Deny</button>
            </div>
          ))
        )}

        <h3>Conversations</h3>
        {connections
          .filter(con => con.is_active)
          .map(con => {
            const otherUserId = getOtherUserId(con);
            const otherUser = userDetails[otherUserId];

            return (
              <div
                key={`con-${con.id}`}
                className="connection-card"
                onClick={() => {
                  setSelectedConnection(con);
                  setSelectedRequest(null);
                }}
              >
                {otherUser ? (
                  <p>
                    Chat with {otherUser.first_name} {otherUser.last_name}
                  </p>
                ) : (
                  <p>Loading user info...</p>
                )}
              </div>
            );
          })}
      </aside>

      <main className="chat-window">
        {selectedConnection ? (
          <>
            <h2>
              Chatting with{" "}
              {userDetails[getOtherUserId(selectedConnection)]
                ? `${userDetails[getOtherUserId(selectedConnection)].first_name} ${userDetails[getOtherUserId(selectedConnection)].last_name}`
                : "someone"}
            </h2>
            <div className="messages">
              {messages.map((msg, index) => {
                const senderName = msg.sender_id === currentUser.id
                  ? "You"
                  : userDetails[msg.sender_id]
                    ? `${userDetails[msg.sender_id].first_name}`
                    : "Someone";

                return (
                  <p key={index}>
                    <strong>{senderName}:</strong> {msg.content}
                  </p>
                );
              })}
            </div>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..." />
            <button onClick={handleSend}>Send</button>
          </>
        ) : selectedRequest ? (
          <div className="request-info">
            <p>
              Pending connection request from{" "}
              {userDetails[selectedRequest.sender_id]
                ? `${userDetails[selectedRequest.sender_id].first_name} ${userDetails[selectedRequest.sender_id].last_name}`
                : "unknown user"}

            </p>
            <p>
              {selectedRequest.message}
            </p>
          </div>
        ) : (
          <p>Select a conversation or request</p>
        )}
      </main>
    </div></>
  );
}
