import React from 'react';


const FoundersLogPage = () => {
    return (
        <div className="founders-body">
            <h1>Meet the Devs</h1>
            <div className="devs-div">
                <strong>Ti James</strong><br />
                UI Owner, Gamer Extraordinaire, Master of Dad Jokes and Naps
            </div>
            <div className="devs-div">
                <strong>Skyler McLain</strong><br />
                Debugging Wizard, Architectural Alchemist, PC Gamer
            </div>
            <div className="devs-div">
                <strong>Ricardo Tizón</strong><br />
                Product Whisperer and Code Poet and Head Boy of All Things
            </div>
            <div className="devs-div">
                <strong>Cayla Thompson</strong><br />
                Peacekeeper, Mental Health Champion, Full-Stack Ninja, Dog Mom
            </div>
            <p>We hope you enjoy what we've built as much as we loved building it.</p>
            <div className="action-buttons-container">
                <button className="magic-button left-button">BACK TO BARTER BUDDY!</button>
            </div>
        </div>
    );
};

export default FoundersLogPage;
