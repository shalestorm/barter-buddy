import React, { useEffect, useRef } from 'react';
import '../styles/WelcomePage.css';
import Ava from '../assets/CarouselUserPhotos/AvaR.png';
import Ellie from '../assets/CarouselUserPhotos/EllieM.png';
import Julian from '../assets/CarouselUserPhotos/JulianR.png';
import Kira from '../assets/CarouselUserPhotos/KiraT.png';
import Lena from '../assets/CarouselUserPhotos/LenaC.png';
import Marcus from '../assets/CarouselUserPhotos/MarcusB.png';
import Mila from '../assets/CarouselUserPhotos/MilaS.png';
import Noah from '../assets/CarouselUserPhotos/NoahP.png';
import Ronan from '../assets/CarouselUserPhotos/RonanV.png';
import Ty from '../assets/CarouselUserPhotos/TyM.png';


const carouselData = [
    {
        name: "Ava Reynolds",
        skill: "Photography and editing basics",
        wants: "Learn watercolor painting",
        photo: Ava,
    },
    {
        name: "Julian Rivera",
        skill: "Guitar and songwriting techniques",
        wants: "Improve public speaking",
        photo: Julian,
    },
    {
        name: "Lena Cho",
        skill: "Beginner-friendly yoga flows",
        wants: "Learn basic JavaScript",
        photo: Lena,
    },
    {
        name: "Marcus Bennett",
        skill: "Budgeting and money management",
        wants: "Trade for web design tips",
        photo: Marcus,
    },
    {
        name: "Noah Patel",
        skill: "Intro to graphic design with Canva",
        wants: "Learn how to crochet",
        photo: Noah,
    },
    {
        name: "Ellie Marsh",
        skill: "Basic French conversation",
        wants: "Practice watercolor techniques",
        photo: Ellie,
    },
    {
        name: "Kira Thorne",
        skill: "Tarot for self-reflection and goal-setting",
        wants: "Learn digital art software",
        photo: Kira,
    },
    {
        name: "Ty Mason",
        skill: "Fitness coaching for beginners",
        wants: "Learn how to cook vegetarian meals",
        photo: Ty,
    },
    {
        name: "Mila Stone",
        skill: "Journaling and creative writing prompts",
        wants: "Trade for photo editing techniques",
        photo: Mila,
    },
    {
        name: "Ronan Vale",
        skill: "Intro to herbal remedies and plant care",
        wants: "Learn basic Python programming",
        photo: Ronan,
    }
];

export default function Carousel() {

    const trackRef = useRef(null);


    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        track.innerHTML += track.innerHTML;

        let scrollSpeed = 0.5;
        let animationFrame;

        const scroll = () => {
            track.scrollLeft += scrollSpeed;

            if (track.scrollLeft >= track.scrollWidth / 2) {
                track.scrollLeft = 0;
            }
            animationFrame = requestAnimationFrame(scroll);
        };
        animationFrame = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrame);
    }, []);


    return (
        <div className="carousel-wrapper">
            <h2 className="carousel-heading">✨ Meet Your Future Barter Buddies ✨</h2>
            <div className="carousel">
                <div className="carousel-track" ref={trackRef}>
                    {carouselData.map((profile, index) => (
                        <div className="carousel-card" key={index}>
                            <img
                                src={profile.photo}
                                alt={`${profile.name}'s profile`}
                                className="carousel-user-img"
                            />
                            <h3>{profile.name}</h3>
                            <p><strong>Can Teach:</strong> {profile.skill}</p>
                            <p><strong>Wants to Learn:</strong> {profile.wants}</p>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

/* I created a carousel that scrolls through sample users who can trade skills.
It uses fake data for now, like someone who knows photography and wants to learn
painting. I added images, made it scroll on its own, and duplicated the content
so it loops without stopping. Each card shows the user’s name, photo, what they
can teach, and what they want to learn. I also styled the background and text to
fit the magical theme. - CT */
