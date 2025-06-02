import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/DashboardPage.css"

const DashboardPage = () => {
    const { user, loading } = useAuth();
    const [users, setUsers] = useState([]);
    const [excludedUserIds, setExcludedUserIds] = useState(new Set());
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const usersPerPage = 5;

    const API_BASE = "http://localhost:8000";

    const fetchSkillCategories = async () => {
        try {
            // RIC: fetch skill categories
            const categoriesRes = await fetch(`${API_BASE}/categories`);

            if (!categoriesRes.ok) {
                throw new Error("Failed to fetch skill categories");
            }

            const catData = await categoriesRes.json();

            setCategories(catData);

        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }


    //user shuffler
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const fetchUsersAndSkills = async () => {
        try {
            const connectionsRes = await fetch(`${API_BASE}/connections/user/${user.id}`);
            const connectionsData = connectionsRes.ok ? await connectionsRes.json() : [];

            const connectedUserIds = new Set();
            connectionsData.forEach((conn) => {
                if (conn.user_a_id !== user.id) connectedUserIds.add(conn.user_a_id);
                if (conn.user_b_id !== user.id) connectedUserIds.add(conn.user_b_id);
            });
            const sentReqRes = await fetch(`${API_BASE}/connection_requests/sent/${user.id}`);
            const sentReqData = sentReqRes.ok ? await sentReqRes.json() : [];
            const sentRequestIds = new Set(sentReqData.map((req) => req.receiver_id));
            const recReqRes = await fetch(`${API_BASE}/connection_requests/received/${user.id}`);
            const recReqData = recReqRes.ok ? await recReqRes.json() : [];
            const receivedRequestIds = new Set(recReqData.map((req) => req.sender_id));
            const allExcludedIds = new Set([
                ...connectedUserIds,
                ...sentRequestIds,
                ...receivedRequestIds,
                user.id,
            ]);
            setExcludedUserIds(allExcludedIds);

            const usersRes = await fetch(`${API_BASE}/users`);
            if (!usersRes.ok) throw new Error("Failed to fetch users");
            const usersData = await usersRes.json();
            const usersWithSkills = await Promise.all(
                usersData.map(async (u) => {
                    const skillsRes = await fetch(`${API_BASE}/user-skills/user/${u.id}/skills`);
                    if (!skillsRes.ok) {
                        console.error(`Failed to fetch skills for user ${u.id}`);
                        return { ...u, skills: [] };
                    }
                    const skills = await skillsRes.json();
                    return { ...u, skills };
                })
            );
            const shuffledUsers = shuffleArray(usersWithSkills);
            setUsers(shuffledUsers);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchUsersAndSkills();
        }
    }, [user]);

    // RIC: fetch categories on load
    useEffect(() => {
        fetchSkillCategories();
    }, []);

    if (loading) return <div>Loading...</div>;

    const filteredUsers = users
        .filter((u) => !excludedUserIds.has(u.id))
        .filter((u) =>
            selectedCategory === "" ||
            u.skills.some((skill) => skill.category_id === Number(selectedCategory))
        )

    useEffect(() => {
        setCurrentPage(1)
    }, [selectedCategory]);


    return (
        <>
            <Header />
            <div className="dashboard-container">
                <div className="browse-container">
                    <h2>Browse Knowledge Sharers</h2>
                    <h3>Explore users who are offering and looking to learn new skills.</h3>
                    <div>
                        <label htmlFor="category-select">Filter results by skill category: </label>
                        <select
                            id="category-select"
                            name="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">-- Random --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                            {/*RIC: Not necessary? Should any be displayed by default? Any way to randomize? */}
                            {/* <option value="13">Surprise Me!</option> */}
                        </select>
                    </div>
                    <br />
                    <div className="browse-buttons">
                        <button className="magic-button" onClick={(e) => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        <button className="magic-button" onClick={(e) => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(
                            filteredUsers.length / usersPerPage
                        )}>Next</button>
                    </div>
                    <div
                        className="card-scroll-container"
                    >
                        {filteredUsers
                            .slice(((currentPage - 1) * usersPerPage), (currentPage * usersPerPage))
                            .map((u) => (
                                <div
                                    key={u.id}
                                    className="user-card"
                                    onClick={() => navigate(`/profile/${u.id}`)}
                                >
                                    <div className="user-header">
                                        <img src={u.profile_pic} alt={u.username} className="card-pic" />
                                        <h4>
                                            {u.first_name} {u.last_name.charAt(0)}.
                                        </h4>
                                    </div>
                                    <ul className="card-ul">
                                        {(selectedCategory
                                            ? u.skills.filter((s) => s.category_id === Number(selectedCategory))
                                            : u.skills).slice(0, 5).map((skill, index) => (
                                                <li key={index}>{skill.name}</li>
                                            ))} {/* Display skills that match selected category*/}
                                    </ul>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DashboardPage;
