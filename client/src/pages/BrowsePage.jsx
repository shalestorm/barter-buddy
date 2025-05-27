import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const BrowsePage = () => {
    const { user, loading } = useAuth();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/users");
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUsers();
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
            <div>
                {users
                    .filter((u) => u.id !== user?.id)
                    .map((u) => (
                        <div
                            key={u.id}
                            onClick={() => navigate(`/profile/${u.id}`)}
                            style={{
                                border: "1px solid white",
                                padding: "8px",
                                marginBottom: "8px",
                                cursor: "pointer",
                                maxWidth: "300px",
                            }}
                        >
                            {u.username} - {u.name}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default BrowsePage;
