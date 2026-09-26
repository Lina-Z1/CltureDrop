import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css'

const SLIDES = [
    {
        id: 'china',
        city: 'China',
        image: './china.jpg',
        title: 'Explore the World',
        text: 'Discover sights, food, and stories from destinations across the globe.',
    },
    {
        id: 'rome',
        city: 'Rome',
        image: './rome.jpg',
        title: 'Explore the World',
        text: 'Discover sights, food, and stories from destinations across the globe.',
    },
    {
        id: 'petra',
        city: 'Petra',
        image: './petra.jpg',
        title: 'Explore the World',
        text: 'Discover sights, food, and stories from destinations across the globe.',
    },
];

function Hero() {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const goToDestinations = () => navigate('/destinations');

    return (
        <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {SLIDES.map((slide, i) => (
                    <button
                        key={slide.id}
                        type="button"
                        data-bs-target="#carouselExampleDark"
                        data-bs-slide-to={i}
                        className={i === 0 ? 'active' : ''}
                        aria-current={i === 0 ? 'true' : undefined}
                        aria-label={`Slide ${i + 1}`}
                    >
                        <img src={slide.image} className="d-block w-100" alt="Destination highlight" />
                    </button>
                ))}
            </div>
            <div className="carousel-inner">
                {SLIDES.map((slide, i) => (
                    <div key={slide.id} className={`carousel-item ${i === 0 ? 'active' : ''}`} data-bs-interval="2000">
                        <img src={slide.image} className="d-block w-100" alt="Destination highlight" />
                        <div className="carousel-caption d-block position-absolute top-50 start-0 text-start ms-3 ms-md-5 translate-middle-y">
                            <h5 className="hero-title fw-bold text-white">{slide.title}</h5>
                            <p className="text-white mb-2 mb-md-3">{slide.text}</p>
                            <button
                                type="button"
                                className="btn btn-light hero-btn rounded-pill fw-semibold px-4"
                                onClick={goToDestinations}
                            >
                                Explore Destinations
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Hero;