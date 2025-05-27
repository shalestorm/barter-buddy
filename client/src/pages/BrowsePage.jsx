import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const BrowsePage = () => {
    const { user, loading } = useAuth();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const API_BASE = "http://localhost:8000";

    const fetchUsersAndSkills = async () => {
        try {
            const res = await fetch(`${API_BASE}/users`);
            if (!res.ok) throw new Error("Failed to fetch users");
            const usersData = await res.json();

            const usersWithSkills = await Promise.all(
                usersData.map(async (u) => {
                    const skillsRes = await fetch(`${API_BASE}/user-skills/user/${u.id}/skills`);
                    if (!skillsRes.ok) {
                        console.error(`Failed to fetch skills for user ${u.id}`);
                        return { ...u, skills: [] };
                    }
                    const skills = await skillsRes.json();
                    const skillNames = skills.map(skill => skill.name);
                    return { ...u, skills: skillNames };
                })
            );

            setUsers(usersWithSkills);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsersAndSkills();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="testing-browse">
            <h2>Browse Knowledge Sharers</h2>
            {user ? (
                <>
                    <p>Logged in as: {user.username}</p>
                    <div

                        onClick={() => navigate(`/profile/${user.id}`)}
                        style={{
                            border: "1px solid white",
                            padding: "8px",
                            marginBottom: "12px",
                            cursor: "pointer",
                            maxWidth: "300px",
                        }}
                    >
                        {user.username} - {user.name} (You)
                        <img
                            src={user.profile_pic}
                            alt={`${user.username}'s profile`}
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                    </div>

                </>
            ) : (
                <p>Not logged in</p>
            )}

            <p>Explore users who are offering and looking to learn new skills.</p>

            <h3>FOR TESTING PURPOSES: Click profiles below</h3>
            {/*obviously move the inline styles elsewhere, just some template example display*/}
            <div className="card-scroll-container" style={{ display: "flex", overflowX: "auto", gap: "12px", scrollbarColor: "white", maxWidth: "800px" }}>
                {users
                    .filter((u) => u.id !== user?.id)
                    .map((u) => (
                        <div
                            key={u.id}
                            className="user-card"
                            onClick={() => navigate(`/profile/${u.id}`)}
                            style={{ border: "solid white 1px", margin: "8px", padding: "5px", minWidth: "210.531px" }}
                        >
                            <img src={u.profile_pic} alt={u.username} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                            <div className="user-info">
                                <h4>
                                    {u.first_name} {u.last_name.charAt(0)}.
                                </h4>
                                <ul style={{ textAlign: "left" }}>
                                    {(u.skills || []).slice(0, 5).map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default BrowsePage;
