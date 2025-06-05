import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import gsap from 'gsap';
import '../styles/DevCard.css';

const DevCard = ({ name, title, roleTitle, roleSubtitle, roleDescription, house, photo, cartoon }) => {
    const [flipped, setFlipped] = useState(false);
    const textRef = useRef();

    const handleFlip = () => {
        setFlipped(!flipped);
    };

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
        <div className={`dev-card ${house}`} onMouseEnter={handleFlip} onMouseLeave={handleFlip}>
            <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
                <div className="card-front">
                    <img src={photo} alt={name} />
                </div>
                <div className="card-back">
                    <img src={cartoon} alt={`${name} cartoon`} />
                </div>
            </div>

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
