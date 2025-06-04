// Cayla's Contribution


import React, { useEffect, useRef } from 'react';
import DevCard from '../components/DevCard';
import '../styles/FoundersLogPage.css';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Link } from 'react-router';



gsap.registerPlugin(TextPlugin);

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
            {/* The animated title that appears at the top */}
            <h1 className="founders-header" ref={titleRef}>Loading title...</h1>

            {/* NEW wrapper div for layout control */}      {/* Wrapper for all card content and outro message */}
            <div className="founders-content">
                {/* Loops through each dev and renders a DevCard for them */}
                <div className="devs-container">
                    {devs.map((dev, i) => (
                        <DevCard key={i} {...dev} />
                    ))}
                </div>
                {/* Closing message at the bottom of the page */}
                <p className="founders-outro">
                    We hope you’ve enjoyed exploring Barter Buddy as much as we’ve loved building it.<br />
                    Thank you for stepping into our world of code, connection, and a little bit of magic. 🪄
                </p>
            </div>
            {/* Navigation link to return to dashboard */}
            <Link to='/dashboard' className='unstyled-link'>
                <h5>--Barter Buddy--</h5>
            </Link>
        </div>
    );



};

export default FoundersLogPage;

// In the FoundersLogPage.jsx file, I started by importing all the tools we need,
// including React, the DevCard component for each team member, our CSS styling,
// GSAP and its TextPlugin for animation, and React Router’s Link for navigation.
// I used GSAP to animate our main title with a magical typewriter effect that
// slowly reveals the phrase “✨ The Order of the Dev: Behind the Magic ✨” when
// the page loads. To do that, I used a useRef to target the title element and a
// useEffect to trigger the animation once the page mounts. Then I created a devs
// array that includes an object for each team member. Each object holds info like
// our name, our role on the project, a fun role subtitle, a brief description of
// our contributions, our Hogwarts house, and both a real photo and a cartoon version.
// This lets us create a fun, personalized experience for each teammate. In the return
// block, I wrapped everything in a main founders-body div. At the top, the animated
// header appears. Then, inside the founders-content, I used .map() to loop through
// the devs array and display a DevCard for each of us using the data we defined above.
// Under the cards, I added a short outro message thanking users for exploring our project,
// and at the very bottom, there's a link that lets you return to the dashboard page.
// Overall, this page is meant to show off our personalities, contributions, and teamwork
// in a fun, magical way that reflects the heart of Barter Buddy. -CT
