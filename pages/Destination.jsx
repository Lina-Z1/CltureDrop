import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import '../styles/Destination.css';
import {
    fetchDestinationPhotos,
    searchDestinations,
    fetchNearbyPlaces,
    fetchWikiSummary,
    fetchCountryInfo,
    fetchLocalFood,
    CITY_TO_COUNTRY,
} from '../services/api';

const Section = ({ eyebrow, title, children }) => (
    <div className="voy-block">
        {eyebrow && <span className="voy-block-kicker">{eyebrow}</span>}
        <h2 className="voy-block-heading">{title}</h2>
        {children}
    </div>
);

const Destination = () => {
    const { id } = useParams();
    const cityName = decodeURIComponent(id);
    const [photos, setPhotos] = useState([]);
    const [places, setPlaces] = useState([]);
    const [wiki, setWiki] = useState(null);
    const [country, setCountry] = useState(null);
    const [food, setFood] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        const countryName = CITY_TO_COUNTRY[cityName] || cityName;

        fetchDestinationPhotos(cityName, 12)
            .then((data) => {
                if (cancelled) return;
                setPhotos(data);
                setLoading(false);
            })
            .catch(() => {
                if (cancelled) return;
                setError('Something went wrong loading this destination.');
                setLoading(false);
            });

        fetchWikiSummary(cityName)
            .then((data) => { if (!cancelled) setWiki(data); })
            .catch(() => { });

        fetchCountryInfo(countryName)
            .then((data) => { if (!cancelled) setCountry(data); })
            .catch(() => { });

        fetchLocalFood(cityName)
            .then((data) => { if (!cancelled) setFood(data); })
            .catch(() => { });


        searchDestinations(cityName)
            .then((geoData) => (geoData?.lat && geoData?.lon ? fetchNearbyPlaces(geoData.lat, geoData.lon) : []))
            .then((nearbyData) => { if (!cancelled) setPlaces(nearbyData.slice(0, 9)); })
            .catch(() => { });

        window.scrollTo(0, 0);

        return () => { cancelled = true; };
    }, [id]);

    if (loading) return (
        <div className="voy-page d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border voy-loader" />
        </div>
    );
    if (error) return (
        <div className="voy-page">
            <p className="voy-fail text-center">{error}</p>
        </div>
    );
    const mainPhoto = photos[1]?.src?.large2x || '/placeholder.jpg';
    const countryDescription = country?.description;

    return (
        <main className="voy-page">
            <div className="voy-banner pt-4" style={{ backgroundImage: `url(${mainPhoto})` }}>
                <div className="voy-banner-shade" />
                <div className="voy-banner-body container">
                    <span className="voy-banner-kicker">Destination</span>
                    <h1 className="voy-banner-heading">{cityName}</h1>
                    {countryDescription && (
                        <p className="voy-banner-blurb">{countryDescription}</p>
                    )}
                    {country?.region && (
                        <div className="d-flex flex-wrap gap-2">
                            <span className="voy-chip">🌍 {country.region}</span>
                            {country.capital && <span className="voy-chip">🏛 {country.capital}</span>}
                            {country.currency && <span className="voy-chip">💱 {country.currency}</span>}
                        </div>
                    )}
                </div>
            </div>
            <div className="container">
                {wiki?.summary && (
                    <Section eyebrow="Overview" title={`About ${cityName}`}>
                        <p className="voy-overview-copy">{wiki.summary}</p>
                    </Section>
                )}
                {photos.length > 1 && (
                    <section className="voy-block">
                        <div className="voy-photos-head">
                            <span className="voy-block-kicker">Gallery</span>
                            <h2 className="voy-block-heading">{cityName} in pictures</h2>
                            <p className="voy-photos-lead">
                                Explore the beauty and culture of {cityName} through our photo collection
                            </p>
                        </div>
                        <div className="carousel slide" data-bs-ride="carousel" id="voyPhotoSlider">
                            <div className="carousel-inner">
                                {Array.from({ length: Math.ceil(photos.length / 4) }).map((_, slideIndex) => (
                                    <div className={`carousel-item ${slideIndex === 0 ? 'active' : ''}`} key={slideIndex}>
                                        <div className="row gy-4">
                                            {photos.slice(slideIndex * 4, slideIndex * 4 + 4).map(photo => (
                                                <div className="col-md-3 col-6" key={photo.id}>
                                                    <img
                                                        src={photo.src.large2x}
                                                        alt={photo.alt}
                                                        className="voy-photo"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="carousel-control-prev" data-bs-slide="prev" data-bs-target="#voyPhotoSlider" type="button">
                                <span aria-hidden="true" className="carousel-control-prev-icon" />
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" data-bs-slide="next" data-bs-target="#voyPhotoSlider" type="button">
                                <span aria-hidden="true" className="carousel-control-next-icon" />
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </section>
                )}
                {food.length > 0 && (
                    <Section eyebrow="Taste" title="Local food and cuisine">
                        <div className="row g-3">
                            {food.map(dish => (
                                <div className="col-6 col-md-4 col-lg-2" key={dish.id}>
                                    <FoodCard dish={dish} />
                                </div>
                            ))}
                        </div>
                    </Section>
                )}
                {places.length > 0 && (
                    <Section eyebrow="Explore" title="Top attractions">
                        <div className="row g-3">
                            {places
                                .filter(p => p.properties?.name)
                                .slice(0, 4)
                                .map((place, i) => {
                                    const name = place.properties?.name;
                                    const kinds = place.properties?.kinds?.split(',')[0]?.replace(/_/g, ' ');
                                    const lat = place.geometry?.coordinates?.[1];
                                    const lon = place.geometry?.coordinates?.[0];
                                    const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                                    return (
                                        <div className="col-6 col-md-3" key={i}>
                                            <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-decoration-none">
                                                <div className="voy-spot-card">
                                                    <div className="voy-spot-icon">
                                                        <img src="/map.gif" alt="attraction" />
                                                    </div>
                                                    <p className="voy-spot-title">{name}</p>
                                                    {kinds && <span className="voy-spot-tag">{kinds}</span>}
                                                    <p className="voy-spot-link">📍 View on Maps</p>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                })}
                        </div>
                    </Section>
                )}

            </div>
        </main>
    );
};

export default Destination;