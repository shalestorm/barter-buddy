import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import "./profilePage.css";
import Header from "../components/Header";
import { useNavigate } from "react-router";
import SendConnectionModal from "../components/SendConnectionModal";

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
    const [newSkill, setNewSkill] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const viewedIdNum = parseInt(viewedUserId);
    const currentIdNum = currentUser?.id;
    const isSelf = viewedIdNum === currentIdNum;
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);


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
    }, [viewedUserId, currentIdNum, isSelf]);

    useEffect(() => {
        if (isSelf && profileData?.profile_pic) {
            setProfilePicUrl(`${profileData.profile_pic}?t=${Date.now()}`);
        }
    }, [profileData?.profile_pic, isSelf, setProfilePicUrl]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await fetch(`/user-skills/user/${viewedUserId}/skills`);
                if (!res.ok) throw new Error("Failed to fetch skills");
                const skillData = await res.json();
                setSkills(skillData);
            } catch (err) {
                console.error("Failed to fetch skills:", err);
            }
        };

        if (viewedUserId) {
            fetchSkills();
        }
    }, [viewedUserId]);

    // gets categories and set default to Other which is id 11 in the db
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:8000/categories/");
                if (!res.ok) throw new Error("Failed to fetch categories");
                const cats = await res.json();
                setCategories(cats);
                setSelectedCategoryId(cats[11].id);
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        };
        fetchCategories();
    }, []);

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

    // fetch for connected users
    useEffect(() => {
        const fetchConnectedUsersWithProfiles = async () => {
            try {
                const res = await fetch(`/connections/user/${viewedUserId}`);
                if (!res.ok) throw new Error("Failed to fetch connected users");
                const connections = await res.json();

                const otherUserIds = connections.map(con =>
                    con.user_a_id === parseInt(viewedUserId) ? con.user_b_id : con.user_a_id
                );

                const userFetches = otherUserIds.map(id =>
                    fetch(`/users/${id}`).then(res => res.json())
                );

                const fullUserProfiles = await Promise.all(userFetches);
                setConnectedUsers(fullUserProfiles);
            } catch (err) {
                console.error("Error loading connected users with profiles:", err);
            }
        };

        if (viewedUserId) {
            fetchConnectedUsersWithProfiles();
        }
    }, [viewedUserId]);


    const handleSendRequest = async (message) => {
        try {
            const res = await fetch("/connection_requests/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender_id: currentIdNum,
                    receiver_id: viewedIdNum,
                    message: message || null,
                }),
            });
            if (!res.ok) throw new Error("Failed to send request");
            setConnectionStatus("pending");
        } catch (err) {
            console.error(err);
        }
    };



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
                                <button className="magic-button" onClick={() => setShowModal(true)}>
                                    Send Connection Request
                                </button>

                            )}
                            <SendConnectionModal
                                isOpen={showModal}
                                onClose={() => setShowModal(false)}
                                onSend={handleSendRequest}
                            />
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
                    <h2>Skills</h2>

                    {isSelf && (
                        <>
                            {!isAddingSkill ? (
                                <button className="magic-button" onClick={() => setIsAddingSkill(true)}>
                                    Add Skill
                                </button>
                            ) : (
                                <div className="add-skill-section">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Enter a new skill"
                                    />
                                    <select
                                        value={selectedCategoryId || ""}
                                        onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="magic-button"
                                        onClick={async () => {
                                            if (!newSkill.trim()) return;
                                            if (!selectedCategoryId) {
                                                alert("Please select a category for the skill.");
                                                return;
                                            }
                                            try {
                                                const createSkillRes = await fetch("http://localhost:8000/skills/", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        name: newSkill.trim(),
                                                        category_id: selectedCategoryId,
                                                    }),
                                                });
                                                if (!createSkillRes.ok) throw new Error("Skill creation failed");
                                                const createdSkill = await createSkillRes.json();

                                                const assignRes = await fetch("/user-skills/", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        user_id: currentIdNum,
                                                        skill_id: createdSkill.id,
                                                    }),
                                                });
                                                if (!assignRes.ok) throw new Error("Skill assignment failed");

                                                setSkills((prev) => [...prev, createdSkill]);
                                                setNewSkill("");
                                                setIsAddingSkill(false);
                                            } catch (err) {
                                                console.error("Error adding skill:", err);
                                            }
                                        }}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        className="magic-button"
                                        onClick={() => {
                                            setIsAddingSkill(false);
                                            setNewSkill("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </>
                    )}


                    <ul className="skill-list">
                        {skills.map((skill) => (
                            <div key={skill.id} className="skill-item">
                                <span>{skill.name} ({skill.category?.name})</span>
                                {isSelf && (
                                    <button
                                        className="magic-button delete-skill"
                                        onClick={async () => {
                                            const confirmed = window.confirm(`Are you sure you want to delete the skill "${skill.name}"?`);
                                            if (!confirmed) return;

                                            try {
                                                const res = await fetch(`/user-skills/user/${currentIdNum}/skill/${skill.id}`, {
                                                    method: "DELETE",
                                                });
                                                if (!res.ok) throw new Error("Failed to delete skill");

                                                // delete skill from state after deletion
                                                setSkills(skills.filter((s) => s.id !== skill.id));
                                            } catch (err) {
                                                console.error("Delete failed:", err);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </ul>
                    {isSelf && (
                        <div className="connected-users-section">
                            <h2>Connected Users</h2>
                            {connectedUsers.length === 0 ? (
                                <p>No connections yet.</p>
                            ) : (
                                <ul className="connected-user-list">
                                    {connectedUsers.map((user) => (
                                        <li key={user.id} className="user-card" onClick={() => navigate(`/profile/${user.id}`)}>
                                            <img
                                                src={user.profile_pic || "/default-avatar.png"}
                                                alt={`${user.first_name} ${user.last_name}`}
                                                className="profile-avatar"
                                            />
                                            <span>{user.first_name} {user.last_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
