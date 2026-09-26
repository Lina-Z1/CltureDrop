import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchCitySuggestions } from '../services/api';
import '../styles/Navbar.css'

function Navbar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const { pathname } = useLocation();


    useEffect(() => {
        const menu = document.getElementById('navbarSupportedContent9');
        if (menu?.classList.contains('show')) {
            document.querySelector('.navbar-toggler')?.click();
        }
        setShowDropdown(false);
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        const timer = setTimeout(async () => {
            const results = await fetchCitySuggestions(query);
            setSuggestions(results);
            setShowDropdown(results.length > 0);
            setActiveIndex(-1);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const goToCity = (cityName) => {
        setQuery('');
        setSuggestions([]);
        setShowDropdown(false);

        const menu = document.getElementById('navbarSupportedContent9');
        if (menu?.classList.contains('show')) {
            document.querySelector('.navbar-toggler')?.click();
        }

        navigate(`/destinations/${encodeURIComponent(cityName)}`);
        window.scrollTo(0, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const chosen = activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
        if (chosen) goToCity(chosen.city);
        else if (query.trim()) goToCity(query.trim());
    };

    const handleKeyDown = (e) => {
        if (!showDropdown) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    return (

        <nav className='navbar navbar-expand-lg navbar-transparent' >
            <div className="container">
                <Link className="navbar-brand" to="/">
                    CultureDrop</Link> <button aria-controls="navbarSupportedContent9" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-bs-target="#navbarSupportedContent9" data-bs-toggle="collapse" type="button"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent9">
                    <form className="navbar-search d-flex ms-lg-3 mt-3 mt-lg-0 position-relative" role="search" ref={searchRef} onSubmit={handleSubmit}>
                        <div className="input-group rounded-pill overflow-hidden border">
                            <input
                                type="text"
                                className="form-control border-0 shadow-none ps-3 bg-transparent"
                                placeholder="Find destination..."
                                aria-label="Search"
                                aria-describedby="search-btn"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                                autoComplete="off"
                            />
                            <button
                                className="btn btn-secendary px-3 border-0"
                                type="submit"
                                id="search-btn"
                            >
                                <i className="bi bi-search " />
                            </button>
                        </div>

                        {showDropdown && (
                            <ul className="search-dropdown">
                                {suggestions.map((place, i) => (
                                    <li
                                        key={`${place.city}-${i}`}
                                        className={`search-dropdown-item ${i === activeIndex ? 'active' : ''}`}
                                        onMouseDown={(e) => { e.preventDefault(); goToCity(place.city); }}
                                        onMouseEnter={() => setActiveIndex(i)}
                                    >
                                        <i className="bi bi-geo-alt me-2" />
                                        <span className="search-dropdown-city">{place.city}</span>
                                        {place.country && (
                                            <span className="search-dropdown-country">{place.country}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                    <ul className="navbar-nav ms-auto my-2 my-lg-0">
                        <li className="nav-item me-4">
                            <Link className="nav-link" to="/" >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item me-4">
                            <Link className="nav-link" to="/Destinations" >
                                Destinations
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/Contact" >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar


