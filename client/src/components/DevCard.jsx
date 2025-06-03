import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import gsap from 'gsap';
import '../styles/DevCard.css';  // CSS styles for the card

// This component creates a flip-style dev profile card with animation and hover effects
const DevCard = ({ name, title, roleTitle, roleSubtitle, roleDescription, house, photo, cartoon }) => {
    const [flipped, setFlipped] = useState(false); // Keeps track of whether the card is flipped
    const textRef = useRef(); // Ref to animate the name/title text on hover flip

    // Toggles the card between front and back on hover
    const handleFlip = () => {
        setFlipped(!flipped);
    };

    // GSAP animation to update the name/title text smoothly when flipped
    useEffect(() => {
        if (textRef.current) {
            gsap.to(textRef.current, {
                duration: 0.6,
                text: flipped ? roleTitle : `${name} - ${title}`,
                ease: 'power2.inOut',
            });
        }
    }, [flipped, name, title, roleTitle]);


    return (
        // Card wrapper with house-specific class and flip trigger
        <div className={`dev-card ${house}`} onMouseEnter={handleFlip} onMouseLeave={handleFlip}>
            <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
                {/* Front side shows real photo */}
                <div className="card-front">
                    <img src={photo} alt={name} />
                </div>
                {/* Back side shows cartoon version */}
                <div className="card-back">
                    <img src={cartoon} alt={`${name} cartoon`} />
                </div>
            </div>

            {/* Text section below the card */}
            <div className="dev-text">
                <p ref={textRef} className="title-flip-text">{`${name} - ${title}`}</p>
                <p className="role-subtitle">{roleSubtitle}</p>
                <p className="role-description">{roleDescription}</p>
            </div>


        </div>
    );
};

export default DevCard;


// In the DevCard.jsx file, I built a reusable card component that shows
// each developer’s real photo on the front and their cartoon image on the
// back. When you hover over the card, it flips between the front and back
// using a smooth GSAP animation. I also used GSAP to animate the text at
// the bottom of the card — so it changes dynamically when the card flips,
// showing either the person’s name and title or their special project role.
// I used state to track whether the card is flipped or not, and I added a
// hover event that triggers the flip when you mouse over it. Each card also
// has a house-specific color class that ties in with our Harry Potter-inspired
// theme. This component makes our team intro feel fun, interactive, and personalized
// — with both professional and magical vibes. -CT
