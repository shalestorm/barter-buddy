import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EmojiPicker from 'emoji-picker-react'; // External emoji picker component -CT
import magicalWandFile from '../assets/magicalWand.wav'; // Magic wand sound file for send/receive
import '../styles/MessagesPage.css'

export default function MessagesPage() {
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const bottomRef = useRef(null)
  const [unreadMap, setUnreadMap] = useState({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Controls if emoji picker is visible -CT
  const inputRef = useRef(null); // Tracks cursor position in the text input


  const API_BASE = "http://localhost:8000";


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
        const connectionUserIds = connectionsData.map(con =>
          con.user_a_id === currentUser.id ? con.user_b_id : con.user_a_id
        );
        const requestSenderIds = requestsData.map(req => req.sender_id);

        const allUserIds = [...new Set([...connectionUserIds, ...requestSenderIds])];

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



  useEffect(() => {
    const intervalId = setInterval(() => {

      fetch(`${API_BASE}/connection_requests/received/${currentUser.id}`)
        .then((res) => res.json())
        .then((newRequests) => {
          if (newRequests.length !== requests.length) {
            setRequests(newRequests);

            const newSenderIds = newRequests
              .map((req) => req.sender_id)
              .filter((id) => !(id in userDetails));

            if (newSenderIds.length > 0) {
              Promise.all(newSenderIds.map((id) => fetch(`${API_BASE}/users/${id}`).then((res) => res.json()))).then(
                (newUsers) => {
                  setUserDetails((prev) => {
                    const updated = { ...prev };
                    newUsers.forEach((user) => {
                      updated[user.id] = user;
                    });
                    return updated;
                  });
                }
              );
            }
          }
        })
        .catch(console.error);


      fetch(`${API_BASE}/connections/user/${currentUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length !== connections.length) {
            setConnections(data);

            const newConnectionUserIds = data
              .map((conn) => (conn.user_a_id === currentUser.id ? conn.user_b_id : conn.user_a_id))
              .filter((id) => !(id in userDetails));

            if (newConnectionUserIds.length > 0) {
              Promise.all(
                newConnectionUserIds.map((id) => fetch(`${API_BASE}/users/${id}`).then((res) => res.json()))
              ).then((newUsers) => {
                setUserDetails((prev) => {
                  const updated = { ...prev };
                  newUsers.forEach((user) => {
                    updated[user.id] = user;
                  });
                  return updated;
                });
              });
            }
          }
        })
        .catch(console.error);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentUser.id, requests.length, connections.length, userDetails]);


  useEffect(() => {
    if (!selectedConnection) return
    const messageFetch = () => {
      fetch(`${API_BASE}/messages/connection/${selectedConnection.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to find messages");
          return res.json();
        })
        .then(msg => {
          setMessages(prev => {
            const isNew = msg.length > prev.length;
            if (isNew) {
              const latest = msg[msg.length - 1];
              if (latest.sender_id !== currentUser.id) {
                const receiveSound = new Audio(magicalWandFile);
                receiveSound.volume = 0.08; // Keeps volume low
                receiveSound.play().catch(err => console.error("Receive sound error:", err)); // Plays sound when new incoming message is detected -CT
              }
            }
            return msg;
          });


          msg.forEach(message => {
            console.log(message);
            if (message.sender_id !== currentUser.id) {
              fetch(`${API_BASE}/messages/${message.id}/read`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(message.id)
              });
            }
          });
        })
        .catch(console.error);
    };
    messageFetch();
    const intervalId = setInterval(messageFetch, 1000);
    return () => clearInterval(intervalId);
  }, [selectedConnection]);


  const getOtherUserId = (con) => {
    return con.user_a_id === currentUser.id ? con.user_b_id : con.user_a_id;
  };

  const handleSend = (e) => {
    e.preventDefault();

    if (!messageText.trim() || !selectedConnection) return;

    const sendSound = new Audio(magicalWandFile);
    sendSound.volume = 0.08;
    sendSound.play().catch(err => console.error("Audio play error:", err)); // Plays sound when message is sent -CT

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


  useEffect(() => {
    const fetchUnread = () => {
      fetch(`${API_BASE}/messages/user/${currentUser.id}/unread`)
        .then(res => res.json())
        .then(unreadConnectionIds => {
          const unread = {};
          unreadConnectionIds.forEach(connId => {
            unread[connId] = true;
          });
          setUnreadMap(unread);
        })
        .catch(console.error);
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 1000);
    return () => clearInterval(interval);
  }, [currentUser.id]);


  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, messages)

  return (
    <>
      <Header />
      <div className="chat-page">
        <aside className="chat-list">
          <h3>Connection Requests</h3>
          {requests.length === 0 ? (
            <p>You have no pending requests</p>
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
                  {userDetails[req.sender_id]
                    ? `${userDetails[req.sender_id].first_name} ${userDetails[req.sender_id].last_name}`
                    : "unknown user"}
                </p>
                <h6>- - click for details - -</h6>
              </div>
            ))
          )}

          <h3>Conversations</h3>
          {connections.length === 0 ? (
            <p>You have no connections</p>
          ) : (
            connections
              .filter(con => con.is_active)
              .map(con => {
                const otherUserId = getOtherUserId(con);
                const otherUser = userDetails[otherUserId];
                const hasUnread = unreadMap[con.id];

                return (
                  <div
                    key={`con-${con.id}`}
                    className={hasUnread ? "unread-connection-card" : "connection-card"}
                    onClick={() => {
                      setSelectedConnection(con);
                      setSelectedRequest(null);
                    }}
                  >
                    {otherUser ? (
                      <p>
                        Chat with {otherUser.first_name} {otherUser.last_name}{" "}
                        {hasUnread ? "🦉!" : ""}
                      </p>
                    ) : (
                      <p>Loading user info...</p>
                    )}
                  </div>
                );
              }))}
        </aside>

        <main className="chat-window">
          {selectedConnection ? (
            <>
              <div className="chat-info">
                <p>Chatting with:</p>
                <img
                  title="See profile"
                  className="chat-avatar"
                  src={userDetails[getOtherUserId(selectedConnection)].profile_pic}
                  onClick={() => navigate(`/profile/${userDetails[getOtherUserId(selectedConnection)].id}`)} />

                <h2>
                  {userDetails[getOtherUserId(selectedConnection)]
                    ? `${userDetails[getOtherUserId(selectedConnection)].first_name} ${userDetails[getOtherUserId(selectedConnection)].last_name}`
                    : "someone"}
                </h2>
              </div>
              <div className="chat-container">
                <div className="messages" ref={chatRef}>
                  {messages?.length > 0 ? messages.map((msg, index) => {
                    const isMe = msg.sender_id === currentUser.id
                    return (
                      <div
                        key={index}
                        className={isMe ? "my-message" : "their-message"}
                      >
                        {msg.content}
                      </div>
                    );
                  }) : "-- no messages --"}
                  <div ref={bottomRef} />
                </div>
                <form className="chat-form" onSubmit={handleSend}>
                  <input
                    type="text"
                    ref={inputRef}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                  />

                  <button
                    type="button"
                    className="emoji-btn"
                    onClick={() => setShowEmojiPicker((prev) => !prev)} // Toggle emoji picker open/close -CT
                  >
                    🪄
                  </button>

                  <button className="magic-button" type="submit">
                    Send
                  </button>

                  {showEmojiPicker && (
                    <div className="emoji-picker-container">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          const cursorPos = inputRef.current.selectionStart;
                          const newText =
                            messageText.slice(0, cursorPos) +
                            emojiData.emoji +
                            messageText.slice(cursorPos);
                          setMessageText(newText); // Inserts emoji at cursor - CT

                          setTimeout(() => {
                            inputRef.current.focus();
                            inputRef.current.selectionStart = cursorPos + emojiData.emoji.length;
                            inputRef.current.selectionEnd = cursorPos + emojiData.emoji.length;
                          }, 0); // Keeps typing cursor in the right place
                        }}
                      />
                    </div>
                  )}
                </form>

              </div>
            </>
          ) : selectedRequest ? (
            <div className="request-info">
              <p>Pending connection request from:</p>
              <img
                title="See profile"
                className="req-avatar"
                src={userDetails[selectedRequest.sender_id].profile_pic}
                onClick={() => navigate(`/profile/${selectedRequest.sender_id}`)} />
              <h2>
                {userDetails[selectedRequest.sender_id]
                  ? `${userDetails[selectedRequest.sender_id].first_name} ${userDetails[selectedRequest.sender_id].last_name}`
                  : "unknown user"}
              </h2>
              <p className="request-message">
                {selectedRequest.message}
              </p>
              <div className="request-buttons">
                <button className="magic-button" onClick={() => handleAcceptRequest(selectedRequest)}>Accept</button>
                <button className="magic-button" onClick={() => handleDenyRequest(selectedRequest)}>Deny</button>
              </div>
            </div>
          ) : (
            <div>{"<--"} Select a conversation or request</div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

// In MessagesPage.jsx, I added two new interactive features to enhance
// the user experience: emoji support and magical sound effects. First,
// I integrated the emoji-picker-react library so users can click a magic
// wand button to open a visual emoji picker. When you select an emoji, it
// inserts directly where your cursor is in the message box. I used useRef
// to keep track of the cursor position and make sure it doesn't jump after
// adding an emoji. Second, I added a soft magical chime sound using a .wav
// file that plays when a message is sent or when a new one is received. This
// adds some whimsy and feedback for users, helping messages feel more magical
// and alive. I added this using the Audio object and set a low volume to keep
// it pleasant. Together, these upgrades make the chat experience feel more fun,
// engaging, and on-brand with our magical theme. -CT
