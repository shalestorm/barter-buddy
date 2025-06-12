import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import '../styles/ProfilePage.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router";
import SendConnectionModal from "../components/SendConnectionModal";
import DeleteSkillModal from "../components/DeleteSkillModal";
import pen from "../assets/edit-pen.png"
import { API_BASE_URL } from "../config";

const ProfilePage = () => {
    const { userId: viewedUserId } = useParams();
    const { user: currentUser, profilePicUrl, setProfilePicUrl } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState("loading");
    const [loading, setLoading] = useState(true);
    const [editingBio, setEditingBio] = useState(false);
    const [bioInput, setBioInput] = useState("");
    const fileInputRef = useRef();
    const nameChangeRef = useRef();
    const [editingName, setEditingName] = useState(false);
    const [firstNameInput, setFirstNameInput] = useState("");
    const [lastNameInput, setLastNameInput] = useState("");
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);
    const [refreshCategories, setRefreshCategories] = useState(false);


    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const profileRes = await fetch(`${API_BASE_URL}/users/${viewedUserId}`);
                if (!profileRes.ok) throw new Error("Failed to fetch user profile");
                const profile = await profileRes.json();
                setProfileData(profile);

                if (!isSelf) {
                    const [connectionsRes, sentRes, receivedRes] = await Promise.all([
                        fetch(`${API_BASE_URL}/connections/user/${currentIdNum}`),
                        fetch(`${API_BASE_URL}/connection_requests/sent/${currentIdNum}`),
                        fetch(`${API_BASE_URL}/connection_requests/received/${currentIdNum}`),
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
                const res = await fetch(`${API_BASE_URL}/user-skills/user/${viewedUserId}/skills`);
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories/`);
                if (!res.ok) throw new Error("Failed to fetch categories");
                const cats = await res.json();
                setCategories(cats);
                setSelectedCategoryId(cats[11].id);
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        };
        fetchCategories();
    }, [refreshCategories]);

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profile_pic", file);

        try {
            const res = await fetch(`${API_BASE_URL}/users/me/profile_pic`, {
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

    const handleNameUpdate = async () => {
        const nameUpdateData = {
            first_name: firstNameInput.trim(),
            last_name: lastNameInput.trim(),
        };

        try {
            const res = await fetch(`${API_BASE_URL}/users/me/names`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nameUpdateData),
            });
            if (!res.ok) throw new Error("Names update failed");

            const updated = await res.json();
            setProfileData(updated);
            setEditingName(false);
        } catch (err) {
            console.error("Failed to update names:", err);
        }
    };

    const handleBioSubmit = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/me/bio`, {
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
        const fetchConnectedUsersWithProfiles = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/connections/user/${viewedUserId}`);
                if (!res.ok) throw new Error("Failed to fetch connected users");
                const connections = await res.json();

                const otherUserIds = connections.map(con =>
                    con.user_a_id === parseInt(viewedUserId) ? con.user_b_id : con.user_a_id
                );

                const userFetches = otherUserIds.map(id =>
                    fetch(`${API_BASE_URL}/users/${id}`).then(res => res.json())
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
            const res = await fetch(`${API_BASE_URL}/connection_requests/`, {
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


    const handleDeleteSkill = async (skillId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/user-skills/user/${currentIdNum}/skill/${skillId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete skill");

            setSkills(skills.filter((s) => s.id !== skillId));
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setShowDeleteModal(false);
            setSkillToDelete(null);
        }
    };


    if (loading) return <div>Loading...</div>;
    if (!profileData) return <div>Profile not found.</div>;
    if (connectionStatus === "error") return <div>Error loading profile.</div>;

    return (
        <>
            <Header />
            <div className="profile-container">

                <div className="profile-left">
                    <div className="profile-scroll-card">
                        <div className="profile-pic-wrapper">
                            {isSelf && (
                                <img
                                    src={pen}
                                    alt="edit pen"
                                    className="edit-pen"
                                    onClick={() => fileInputRef.current?.click()}
                                />
                            )}
                            <img
                                src={profileData.profile_pic || profilePicUrl || "/default-avatar.png"}
                                alt="User avatar"
                                className={`main-profile-avatar${isSelf ? "hoverable" : ""}`}
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
                        <div className="profile-name-wrapper">
                            {!editingName ? (
                                <>
                                    <h1 className="profile-name">
                                        {profileData.first_name} {profileData.last_name}
                                    </h1>
                                    {isSelf && (
                                        <button className="magic-button" onClick={() => {
                                            setFirstNameInput(profileData.first_name || "");
                                            setLastNameInput(profileData.last_name || "");
                                            setEditingName(true);
                                        }}>
                                            Edit Name
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="edit-name-section">
                                    <form
                                        className="edit-name-form"
                                        onSubmit={handleNameUpdate}
                                    >
                                        <div className="edit-name-inputs">
                                            <label htmlFor="first-name-input">First Name:</label>
                                            <input
                                                id="firstname-input"
                                                type="text"
                                                value={firstNameInput}
                                                onChange={(e) => setFirstNameInput(e.target.value)}
                                                placeholder="You must have a first name"
                                                required
                                                maxLength={16}
                                            />
                                            <label htmlFor="last-name-input">Last Name:</label>
                                            <input
                                                id="lastname-input"
                                                type="text"
                                                value={lastNameInput}
                                                onChange={(e) => setLastNameInput(e.target.value)}
                                                placeholder="You must have a last name"
                                                required
                                                maxLength={16}
                                            />
                                        </div>
                                        <div className="name-btns">
                                            <button type="submit" className="magic-button">Save</button>
                                            <button className="magic-button" onClick={() => setEditingName(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

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

                    <div className="skills-box">
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
                                            maxLength={32}
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
                                        <div className="add-skill-btns">
                                            <button
                                                className="magic-button"
                                                onClick={async () => {
                                                    if (!newSkill.trim()) return;
                                                    if (!selectedCategoryId) {
                                                        alert("Please select a category for the skill.");
                                                        return;
                                                    }
                                                    try {
                                                        const createSkillRes = await fetch(`${API_BASE_URL}/skills/`, {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({
                                                                name: newSkill.trim(),
                                                                category_id: selectedCategoryId,
                                                            }),
                                                        });
                                                        if (!createSkillRes.ok) throw new Error("Skill creation failed");
                                                        const createdSkill = await createSkillRes.json();

                                                        const assignRes = await fetch(`${API_BASE_URL}/user-skills/`, {
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
                                                        setRefreshCategories((prev) => !prev);
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
                                    </div>
                                )}
                            </>
                        )}

                        <ul className="skill-list">
                            {skills.map((skill) => (
                                <div key={skill.id} className="skill-item">
                                    <div className="skill-info">
                                        <span>{skill.name}</span>
                                        <h5>({skill.category?.name})</h5>
                                    </div>
                                    {isSelf && (
                                        <button
                                            className="magic-button delete-button"
                                            onClick={() => {
                                                setSkillToDelete(skill);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            X
                                        </button>
                                    )}
                                </div>
                            ))}
                        </ul>

                        <DeleteSkillModal
                            isOpen={showDeleteModal}
                            onClose={() => {
                                setShowDeleteModal(false);
                                setSkillToDelete(null);
                            }}
                            onConfirm={handleDeleteSkill}
                            skill={skillToDelete}
                        />
                    </div>
                </div>


                <div className="profile-right">
                    <div className="bio-box">
                        <h2>Bio</h2>
                        {!editingBio ? (
                            <>
                                <div className="bio-text">
                                    {profileData.bio || "-- No information --"}
                                </div>
                                {isSelf && (
                                    <button className="magic-button" onClick={() => {
                                        setBioInput(profileData.bio || "");
                                        setEditingBio(true);
                                    }}>
                                        Edit Bio
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="edit-bio-section">
                                <textarea
                                    value={bioInput}
                                    onChange={(e) => setBioInput(e.target.value)}
                                    className="bio-textarea"
                                    placeholder="Write something about yourself..."
                                    maxLength={255}
                                />
                                <div className="bio-btns">
                                    <button className="magic-button" onClick={handleBioSubmit}>Save</button>
                                    <button className="magic-button" onClick={() => setEditingBio(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="connections-box">
                        <h2>Connections</h2>
                        {connectedUsers.length === 0 ? (
                            <p>No connections yet.</p>
                        ) : (
                            <ul className="connected-user-list two-columns">

                                {connectedUsers.map((user) => (
                                    <li key={user.id} className="con-user-card" onClick={() => navigate(`/profile/${user.id}`)}>
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
                </div>
            </div>
            <Footer />
        </>
    );

};

export default ProfilePage;
