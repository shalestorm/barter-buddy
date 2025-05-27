import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import Header from "../components/Header";

const DashboardPage = () => {
    const { user, loading } = useAuth();
    const [users, setUsers] = useState([]);
    const [excludedUserIds, setExcludedUserIds] = useState(new Set());
    const navigate = useNavigate();

    const API_BASE = "http://localhost:8000";

    const fetchUsersAndSkills = async () => {
        try {
            // 1. Fetch connections
            const connectionsRes = await fetch(`${API_BASE}/connections/user/${user.id}`);
            const connectionsData = connectionsRes.ok ? await connectionsRes.json() : [];

            // Extract connected user ids
            const connectedUserIds = new Set();
            connectionsData.forEach((conn) => {
                // Each connection has user_a_id and user_b_id, one of which is current user
                if (conn.user_a_id !== user.id) connectedUserIds.add(conn.user_a_id);
                if (conn.user_b_id !== user.id) connectedUserIds.add(conn.user_b_id);
            });

            // 2. Fetch sent requests
            const sentReqRes = await fetch(`${API_BASE}/connection_requests/sent/${user.id}`);
            const sentReqData = sentReqRes.ok ? await sentReqRes.json() : [];
            const sentRequestIds = new Set(sentReqData.map((req) => req.receiver_id));

            // 3. Fetch received requests
            const recReqRes = await fetch(`${API_BASE}/connection_requests/received/${user.id}`);
            const recReqData = recReqRes.ok ? await recReqRes.json() : [];
            const receivedRequestIds = new Set(recReqData.map((req) => req.sender_id));

            // Combine all excluded user ids
            const allExcludedIds = new Set([
                ...connectedUserIds,
                ...sentRequestIds,
                ...receivedRequestIds,
                user.id, // Also exclude self
            ]);
            setExcludedUserIds(allExcludedIds);

            // 4. Fetch all users
            const usersRes = await fetch(`${API_BASE}/users`);
            if (!usersRes.ok) throw new Error("Failed to fetch users");
            const usersData = await usersRes.json();

            // 5. Fetch skills for each user
            const usersWithSkills = await Promise.all(
                usersData.map(async (u) => {
                    const skillsRes = await fetch(`${API_BASE}/user-skills/user/${u.id}/skills`);
                    if (!skillsRes.ok) {
                        console.error(`Failed to fetch skills for user ${u.id}`);
                        return { ...u, skills: [] };
                    }
                    const skills = await skillsRes.json();
                    const skillNames = skills.map((skill) => skill.name);
                    return { ...u, skills: skillNames };
                })
            );

            setUsers(usersWithSkills);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchUsersAndSkills();
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Header />
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

                {/* TI BRANCH START

                <button
                    onClick={async () => {
                        const success = await logout();
                        if (success) navigate("/login");
                    }}
                    style={{
                        marginBottom: "20px",
                        padding: "6px 12px",
                        backgroundColor: "#444",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px",
                    }}
                >
                    Log Out
                </button>

                {/* TI BRANCH END */}


                <p>Explore users who are offering and looking to learn new skills.</p>

                <h3>FOR TESTING PURPOSES: Click profiles below</h3>
                <div
                    className="card-scroll-container"
                    style={{ display: "flex", overflowX: "auto", gap: "12px", scrollbarColor: "white", maxWidth: "800px" }}
                >
                    {users
                        .filter((u) => !excludedUserIds.has(u.id)) // exclude connected/requested users & self
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
        </>
    );
};

export default DashboardPage;
