import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import "./profilePage.css";
import Header from "../components/Header";

const ProfilePage = () => {
    const { userId: viewedUserId } = useParams();
    const { user: currentUser, profilePicUrl, setProfilePicUrl } = useAuth();

    const [profileData, setProfileData] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("loading");
    const [loading, setLoading] = useState(true);
    const [editingBio, setEditingBio] = useState(false);
    const [bioInput, setBioInput] = useState("");
    const fileInputRef = useRef();

    const [skills, setSkills] = useState([]);
    const [addingSkill, setAddingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState("");


    const viewedIdNum = parseInt(viewedUserId);
    const currentIdNum = currentUser?.id;

    const isSelf = viewedIdNum === currentIdNum;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const profileRes = await fetch(`/users/${viewedUserId}`);
                if (!profileRes.ok) throw new Error("Failed to fetch user profile");
                const profile = await profileRes.json();
                setProfileData(profile);

                if (!isSelf) {
                    const [connectionsRes, sentRes, receivedRes] = await Promise.all([
                        fetch(`/connections/user/${currentIdNum}`),
                        fetch(`/connection_requests/sent/${currentIdNum}`),
                        fetch(`/connection_requests/received/${currentIdNum}`),
                    ]);

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
                        const hasPending = sentRequests.some(req => req.receiver_id === viewedIdNum) ||
                            receivedRequests.some(req => req.sender_id === viewedIdNum);
                        setConnectionStatus(hasPending ? "pending" : "none");
                    }
                } else {
                    setConnectionStatus("self");
                }
            } catch (err) {
                console.error(err);
                setConnectionStatus("error");
            } finally {
                setLoading(false);
            }
        };

        if (viewedUserId && currentIdNum != null) {
            fetchProfileData();
        }
    }, [viewedUserId, currentIdNum]);

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profile_pic", file);

        try {
            const res = await fetch("http://localhost:8000/users/me/profile_pic", {
                method: "PUT",
                body: formData,
                credentials: "include",
            });

            if (!res.ok) throw new Error("Upload failed");

            const updated = await res.json();
            const timestampedPic = `${updated.profile_pic}?t=${Date.now()}`;
            setProfileData({ ...updated, profile_pic: timestampedPic });
            setProfilePicUrl(timestampedPic);
        } catch (err) {
            console.error("Failed to upload profile pic:", err);
        }
    };

    const handleBioSubmit = async () => {
        try {
            const res = await fetch("/users/me/bio", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bio: bioInput }),
            });
            if (!res.ok) throw new Error("Bio update failed");

            const updated = await res.json();
            setProfileData(updated);
            setEditingBio(false);
        } catch (err) {
            console.error("Failed to update bio:", err);
        }
    };

    useEffect(() => {
        if (isSelf && profileData?.profile_pic) {
            setProfilePicUrl(`${profileData.profile_pic}?t=${Date.now()}`);
        }
    }, [profileData?.profile_pic, isSelf]);

    if (loading) return <div>Loading...</div>;
    if (!profileData) return <div>Profile not found.</div>;
    if (connectionStatus === "error") return <div>Error loading profile.</div>;

    return (
        <>
            <Header />
            <div className="profile-container">
                <div className="profile-scroll-card">
                    <div className="profile-pic-wrapper">
                        <img
                            src={profileData.profile_pic || profilePicUrl || "/default-avatar.png"}
                            alt="User avatar"
                            className={`profile-avatar ${isSelf ? "hoverable" : ""}`}
                            onClick={() => {
                                if (isSelf) fileInputRef.current?.click();
                            }}
                        />
                        {isSelf && (
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleProfilePicUpload}
                            />
                        )}
                    </div>

                    <h1 className="profile-name">{profileData.first_name} {profileData.last_name}</h1>


                    {connectionStatus !== "self" && (
                        <>
                            {connectionStatus === "connected" && (
                                <button className="magic-button" disabled>Connected</button>
                            )}
                            {connectionStatus === "pending" && (
                                <button className="magic-button" disabled>Request Pending</button>
                            )}
                            {connectionStatus === "none" && (
                                <button className="magic-button" onClick={async () => {
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
                                        if (!res.ok) throw new Error("Failed to send request");
                                        setConnectionStatus("pending");
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}>
                                    Send Connection Request
                                </button>
                            )}
                        </>
                    )}
                </div>
                <div className="profile-bio">
                    {isSelf ? (
                        editingBio ? (
                            <>
                                <textarea
                                    value={bioInput}
                                    onChange={(e) => setBioInput(e.target.value)}
                                    rows={3}
                                />
                                <div style={{ marginTop: "0.5rem" }}>
                                    <button className="magic-button" onClick={handleBioSubmit}>Save</button>
                                    <button
                                        className="magic-button"
                                        onClick={() => {
                                            setEditingBio(false);
                                            setBioInput(profileData.bio ?? "");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p
                                onClick={() => {
                                    setBioInput(profileData.bio ?? "");
                                    setEditingBio(true);
                                }}
                                className="editable-bio"
                                title="Click to edit bio"
                            >
                                {profileData.bio || "Click to add a bio..."}
                            </p>
                        )
                    ) : (
                        <p>{profileData.bio || "A wizard of many talents..."}</p>
                    )}
                </div>
                <div className="user-skill-list">

                </div>
            </div>
        </>
    );
};

export default ProfilePage;
