import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import gsap from 'gsap';
import './DevCard.css';

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
