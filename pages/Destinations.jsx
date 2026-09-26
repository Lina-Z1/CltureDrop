import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CITY_TO_COUNTRY,
    FOOD_CITIES,
    CITY_REGION,
    REGION_ORDER,
    getCachedCityPhoto,
    fetchCityPhotosProgressively,
} from '../services/api';
import '../styles/Destinations.css';

const metaLine = (city) => [CITY_TO_COUNTRY[city], CITY_REGION[city]].filter(Boolean).join(' · ');

const DestinationCard = ({ name, image, status, onOpen }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <button
            type="button"
            className="dest-card"
            onClick={onOpen}
            aria-label={`Open ${name}`}
        >
            <span className={`dest-card__media ${loaded ? 'is-loaded' : ''}`}>
                {status === 'error' ? (
                    <span className="dest-card__fallback">{name}</span>
                ) : (
                    <>
                        {!loaded && <span className="dest-card__skeleton" aria-hidden="true" />}
                        {image && (
                            <img
                                src={image}
                                alt={name}
                                loading="lazy"
                                decoding="async"
                                onLoad={() => setLoaded(true)}
                            />
                        )}
                    </>
                )}
            </span>
            <span className="dest-card__title">{name}</span>
            <span className="dest-card__meta">{metaLine(name)}</span>
        </button>
    );
};
const HeroBanner = ({ name, image, onOpen }) => (
    <button
        type="button"
        className={`dest-hero ${image ? 'has-image' : ''}`}
        style={image ? { backgroundImage: `url(${image})` } : undefined}
        onClick={onOpen}
    >
        {!image && <span className="dest-hero__skeleton" aria-hidden="true" />}
        <span className="dest-hero__scrim" />
        <span className="dest-hero__content">
            <span className="dest-hero__title">{name}</span>
            <span className="dest-hero__meta">{metaLine(name)}</span>
            <span className="dest-hero__cta">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                    <path d="M0 0L10 6L0 12V0Z" />
                </svg>
                Explore {name}
            </span>
        </span>
    </button>
);
const Destinations = () => {
    const [destinations, setDestinations] = useState(() =>
        FOOD_CITIES.map((city, id) => {
            const cached = getCachedCityPhoto(city);
            return {
                id,
                name: city,
                image: cached?.image ?? null,
                status: cached ? 'done' : 'pending',
            };
        })
    );
    const [region, setRegion] = useState('All');
    const [sortDesc, setSortDesc] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('dark-nav-page');
        return () => document.body.classList.remove('dark-nav-page');
    }, []);

    useEffect(() => {
        const cancel = fetchCityPhotosProgressively(FOOD_CITIES, (city, result) => {
            setDestinations((prev) => prev.map((d) => (d.name === city ? { ...d, ...result } : d)));
        });
        return cancel;
    }, []);

    const openDestination = useCallback(
        (city) => navigate(`/destinations/${encodeURIComponent(city)}`),
        [navigate]
    );
    const [heroA, heroB] = destinations;
    const gridItems = useMemo(() => {
        const rest = destinations.filter((d) => d.id !== heroA?.id && d.id !== heroB?.id);
        const filtered = region === 'All' ? rest : rest.filter((d) => CITY_REGION[d.name] === region);
        const sorted = [...filtered].sort((a, b) =>
            sortDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
        );
        return sorted;
    }, [destinations, region, sortDesc, heroA, heroB]);

    return (
        <main className="dest-page">
            <div className="container pt-4">
                <div className="row g-3 mb-4">
                    {heroA && (
                        <div className="col-12 col-md-6">
                            <HeroBanner {...heroA} onOpen={() => openDestination(heroA.name)} />
                        </div>
                    )}
                    {heroB && (
                        <div className="col-12 col-md-6">
                            <HeroBanner {...heroB} onOpen={() => openDestination(heroB.name)} />
                        </div>
                    )}
                </div>
                <div className="dest-toolbar">
                    <h2 className="dest-section-title">
                        {region === 'All' ? 'All destinations' : `Trending in ${region}`}
                    </h2>

                    <div className="dest-filters d-flex flex-wrap justify-content-center gap-2" role="tablist" aria-label="Filter by region">
                        {REGION_ORDER.map((r) => (
                            <button
                                key={r}
                                type="button"
                                role="tab"
                                aria-selected={region === r}
                                className={`dest-chip ${region === r ? 'is-active' : ''}`}
                                onClick={() => setRegion(r)}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="dest-sort"
                        onClick={() => setSortDesc((v) => !v)}
                        aria-label={`Sort ${sortDesc ? 'A to Z' : 'Z to A'}`}
                        title={`Sort ${sortDesc ? 'A to Z' : 'Z to A'}`}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path
                                d={sortDesc ? 'M3 4H11M3 7H9M3 10H7' : 'M3 4H7M3 7H9M3 10H11'}
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
                <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 row-cols-xl-5 g-3 g-lg-4 dest-grid">
                    {gridItems.map((d) => (
                        <div className="col" key={d.id}>
                            <DestinationCard {...d} onOpen={() => openDestination(d.name)} />
                        </div>
                    ))}
                </div>
                {gridItems.length === 0 && <p className="dest-empty">No destinations in this region yet.</p>}
            </div>
        </main>
    );
};

export default Destinations;