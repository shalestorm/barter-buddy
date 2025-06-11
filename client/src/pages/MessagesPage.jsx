import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EmojiPicker from 'emoji-picker-react';
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const prevMessagesLength = useRef(0);


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
            if (isNew && chatRef.current) {
              const latest = msg[msg.length - 1];
              if (latest.sender_id !== currentUser.id) {

                setTimeout(scrollToBottom, 0);
              }
            }
            prevMessagesLength.current = msg.length;
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
        setTimeout(() => {
          scrollToBottom();
          setTimeout(scrollToBottom, 50);
        }, 0);
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

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };


  useEffect(() => {
    if (selectedConnection) {

      const timeout = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeout);
    }
  }, [selectedConnection]);


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
                      scrollToBottom();
                      setSelectedRequest(null);
                    }}
                  >
                    {otherUser ? (
                      <p>
                        Chat with {otherUser.first_name} {otherUser.last_name}{" "}
                        {hasUnread ? "💬!" : ""}
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
            <div className="conversation">
              <div className="chat-info">
                <button className="magic-button close-button" onClick={() => setSelectedConnection(null)}>Close</button>
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
                    maxLength={255}
                  />

                  <button
                    type="button"
                    className="emoji-btn"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    😃
                  </button>

                  <button className="magic-button" type="submit">
                    Send
                  </button>

                  {showEmojiPicker && (
                    <div className="emoji-picker-container">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          const emoji = emojiData.emoji || emojiData.native || emojiData.unicode;
                          if (!emoji || !inputRef.current) return;

                          const cursorPos = inputRef.current.selectionStart;

                          setMessageText((prev) => {
                            const newText =
                              prev.slice(0, cursorPos) + emoji + prev.slice(cursorPos);

                            setTimeout(() => {
                              inputRef.current?.focus();
                              inputRef.current.selectionStart = cursorPos + emoji.length;
                              inputRef.current.selectionEnd = cursorPos + emoji.length;
                            }, 0);

                            return newText;
                          });
                        }}
                      />
                    </div>
                  )}
                </form>

              </div>
            </div>
          ) : selectedRequest ? (
            <div className="request-info">
              <button className="magic-button close-button" onClick={() => setSelectedRequest(null)}>Close</button>
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
                {!selectedRequest.message ? "-- This user would like to connect! --" : selectedRequest.message}
              </p>
              <div className="request-buttons">
                <button className="magic-button" onClick={() => handleAcceptRequest(selectedRequest)}>Accept</button>
                <button className="magic-button" onClick={() => handleDenyRequest(selectedRequest)}>Ignore</button>
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
