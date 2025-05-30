// Cayla's Contribution

import React, { useEffect, useRef } from 'react';
import DevCard from '../components/DevCard';
import '../styles/FoundersLogPage.css';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin); // ✅ correct usage

const FoundersLogPage = () => {
    const titleRef = useRef();

    useEffect(() => {
        gsap.to(titleRef.current, {
            duration: 2.5,
            text: '✨ The Order of the Dev: Behind the Magic ✨',
            ease: 'power2.inOut',
        });
    }, []);

    const devs = [
        {
            name: 'Cayla Thompson',
            title: 'Software Engineer',
            roleTitle: 'Team Support/ Wellness Lead/ Floater',
            roleSubtitle: 'The Heart of the Team & Full-stack Familiar',
            roleDescription: 'Supports all areas—frontend, backend, testing—and protects team wellbeing. Maintains clear communication, boosts morale, and ensures balance and flow.',
            house: 'gryffindor',
            photo: '/src/assets/cayla2.png.jpg',
            cartoon: '/src/assets/Cayla.png',
        },
        {
            name: 'Ti James',
            title: 'Software Engineer',
            roleTitle: 'UI Owner',
            roleSubtitle: 'The Layout Luminary & UX Enchanter',
            roleDescription: 'Crafts wireframes, styles components, and ensures visual harmony across the app. Supports frontend layout and design while sprinkling in dad jokes and gamer energy.',
            house: 'ravenclaw',
            photo: '/src/assets/ti.png.jpg',
            cartoon: '/src/assets/Ti2.png'
        },
        {
            name: 'Skyler McLain',
            title: 'Software Engineer',
            roleTitle: 'Architecture Owner',
            roleSubtitle: 'The Backend Alchemist & Debugging Sorcerer',
            roleDescription: 'Builds the project architecture, manages branches and workflows, and resolves backend issues. Guides technical decisions and keeps development running smoothly.',
            house: 'slytherin',
            photo: '/src/assets/skyler.png.jpg',
            cartoon: '/src/assets/Skyler2.png'
        },
        {
            name: 'Ricardo Tizón',
            title: 'Software Engineer',
            roleTitle: 'Product Owner',
            roleSubtitle: 'The Product Whisperer & Agile Alchemist',
            roleDescription: 'Leads sprint planning, defines MVP goals, and keeps the team aligned. Translates ideas into clear user stories and maintains project flow and focus.',
            house: 'hufflepuff',
            photo: '/src/assets/ric.png.png',
            cartoon: '/src/assets/Ric2.png'
        },
    ];

    return (
        <div className="founders-body">
            <h1 className="founders-header" ref={titleRef}>Loading title...</h1>

            {/* NEW wrapper div for layout control */}
            <div className="founders-content">
                <div className="devs-container">
                    {devs.map((dev, i) => (
                        <DevCard key={i} {...dev} />
                    ))}
                </div>

                <p className="founders-outro">
                    We hope you’ve enjoyed exploring Barter Buddy as much as we’ve loved building it.<br />
                    Thank you for stepping into our world of code, connection, and a little bit of magic. 🪄
                </p>
            </div>
        </div>
    );



};

export default FoundersLogPage;
