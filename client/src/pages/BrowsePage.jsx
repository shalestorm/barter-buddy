import React, { useEffect, useState } from 'react';

const BrowsePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/users/auth/me", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("not logged in");
                return res.json();
            })
            .then(data => {
                setUser(data)
            })
            .catch(err => {
                setError(err.message);
                console.error(err)
            });
    }, []);


    return (
        <div className="browse-page">
            <h2>Browse Knowledge Sharers</h2>
            {user ? (
                <p>logged in as: {user.username}</p>
            ) : (<p>not logged in `error: ${error}`</p>)}
            <p>Explore users who are offering and looking to learn new skills.</p>
        </div>
    );
};

export default BrowsePage;
