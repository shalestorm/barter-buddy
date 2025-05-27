import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
    const { userId: viewedUserId } = useParams();
    const { user: currentUser } = useAuth();

    const [profileData, setProfileData] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("loading");
    const [loading, setLoading] = useState(true);

    const viewedIdNum = parseInt(viewedUserId);
    const currentIdNum = currentUser?.id;

    {/* TI BRANCH START */}

    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({ name: "", bio: ""});

    {/* TI BRANCH END */}

    useEffect(() => {
        const fetchUserProfileAndConnection = async () => {
            try {
                setLoading(true);

                const profileRes = await fetch(`/users/${viewedUserId}`);
                if (!profileRes.ok) throw new Error("Failed to fetch user profile");
                const profile = await profileRes.json();
                setProfileData(profile);

                if (viewedIdNum === currentIdNum) {
                    setConnectionStatus("self");
                    return;
                }

                const [connectionsRes, sentRes, receivedRes] = await Promise.all([
                    fetch(`/connections/user/${currentIdNum}`),
                    fetch(`/connection_requests/sent/${currentIdNum}`),
                    fetch(`/connection_requests/received/${currentIdNum}`),
                ]);

                if (!connectionsRes.ok || !sentRes.ok || !receivedRes.ok) {
                    throw new Error("Failed to fetch connection data");
                }

                const [connections, sentRequests, receivedRequests] = await Promise.all([
                    connectionsRes.json(),
                    sentRes.json(),
                    receivedRes.json(),
                ]);

                const isConnected = connections.some(
                    (con) =>
                        (con.user_a_id === viewedIdNum && con.user_b_id === currentIdNum) ||
                        (con.user_b_id === viewedIdNum && con.user_a_id === currentIdNum)
                );

                if (isConnected) {
                    setConnectionStatus("connected");
                } else {
                    const hasPendingRequest =
                        sentRequests.some((req) => req.receiver_id === viewedIdNum) ||
                        receivedRequests.some((req) => req.sender_id === viewedIdNum);
                    setConnectionStatus(hasPendingRequest ? "pending" : "none");
                }
            } catch (err) {
                console.error(err);
                setConnectionStatus("error");
            } finally {
                setLoading(false);
            }
        };

        if (viewedUserId && currentIdNum != null) {
            fetchUserProfileAndConnection();
        }
    }, [viewedUserId, currentIdNum, viewedIdNum]);

    const sendConnectionRequest = async () => {
        try {
            const res = await fetch("/connection_requests/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender_id: currentIdNum,
                    receiver_id: viewedIdNum,
                    message: null,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to send connection request");
            }

            setConnectionStatus("pending");
        } catch (err) {
            console.error("Error sending connection request:", err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!profileData) return <div>Profile not found.</div>;
    if (connectionStatus === "error") return <div>Error loading profile.</div>;

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
            <h1>{profileData.name}</h1>
            <p>{profileData.bio || "No bio available"}</p>


{/* TI BRANCH START */}
            {isEditing && (
    <form
        onSubmit={async (e) => {
            e.preventDefault();
            try {
                const res = await fetch(`/users/${currentIdNum}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedProfile),
                });

                if (!res.ok) throw new Error("Update failed");
                const updated = await res.json();
                setProfileData(updated);
                setIsEditing(false);
            } catch (err) {
                console.error("Failed to update profile:", err);
                alert("Update failed.");
            }
        }}
    >
        <label>
            Name:{" "}
            <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
            />
        </label>
        <br />
        <label>
            Bio:{" "}
            <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
            />
        </label>
        <br />
        <button type="submit">Save</button>
        <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
        </button>
    </form>
)}



            {connectionStatus === "self" && !isEditing && (
                <button onClick={() => {
                    setEditedProfile({ name: profileData.name, bio: profileData.bio || "" });
                    setIsEditing(true);
                }}>
                    Edit Your Profile
                </button>
            )}

{/* TI BRANCH END */}
            {connectionStatus === "connected" && <button disabled>Connected</button>}
            {connectionStatus === "pending" && <button disabled>Request Pending</button>}
            {connectionStatus === "none" && (
                <button onClick={sendConnectionRequest}>Send Connection Request</button>
            )}
        </div>
    );
};

export default ProfilePage;
