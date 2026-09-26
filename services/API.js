const OTM_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;
const OTM_BASE = import.meta.env.VITE_OPENTRIPMAP_BASE_URL;

const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PEXELS_BASE = import.meta.env.VITE_PEXELS_BASE_URL;

const SPOONACULAR_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE = 'https://api.spoonacular.com';

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const GEOAPIFY_BASE = 'https://api.geoapify.com/v1/geocode/autocomplete';

const WIKI_BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary';

const getJSON = async (url, options) => {
    const res = await fetch(url, options);
    return res.json();
};

export const CITY_TO_COUNTRY = {
    Rome: 'Italy',
    Sydney: 'Australia',
    London: 'British',
    Istanbul: 'Turkey',
    Tokyo: 'Japan',
    Kyoto: 'Japan',
    Paris: 'France',
    Barcelona: 'Spain',
    Cairo: 'Egypt',
    Dubai: 'United Arab Emirates',
    Amsterdam: 'Netherlands',
    Bali: 'Indonesia',
    Maldives: 'Maldives',
    Lisbon: 'Portugal',
    'New York': 'American',
    Bangkok: 'Thailand',
    Prague: 'Czech Republic',
};

export const CITY_TO_CUISINE = {
    Rome: 'Italian',
    Sydney: 'Mediterranean',
    London: 'British',
    Istanbul: 'Mediterranean',
    Tokyo: 'Japanese',
    Kyoto: 'Japanese',
    Paris: 'French',
    Barcelona: 'Spanish',
    Cairo: 'Middle Eastern',
    Dubai: 'Middle Eastern',
    Amsterdam: 'European',
    Bali: 'Vietnamese',
    Maldives: 'Indian',
    Lisbon: 'Mediterranean',
    'New York': 'American',
    Bangkok: 'Thai',
    Prague: 'Eastern European',
};

export const fetchWikiSummary = async (query) => {
    const data = await getJSON(`${WIKI_BASE}/${encodeURIComponent(query)}`);
    return {
        summary: data.extract,
        image: data.thumbnail?.source,
        url: data.content_urls?.desktop?.page,
    };
};

export const fetchCountryInfo = async (countryName) => {
    try {
        const data = await getJSON(`${WIKI_BASE}/${encodeURIComponent(countryName)}`);
        return {
            description: data.description,
            summary: data.extract,
            image: data.thumbnail?.source,
            url: data.content_urls?.desktop?.page,
        };
    } catch {
        return null;
    }
};

export const fetchFoodPhoto = async (dishName) => {
    const data = await getJSON(`${PEXELS_BASE}/search?query=${encodeURIComponent(dishName)}&per_page=1`, {
        headers: { Authorization: PEXELS_KEY },
    });
    return data.photos?.[0]?.src?.large2x || null;
};

export const fetchDestinationPhotos = async (query, perPage = 9) => {
    const data = await getJSON(`${PEXELS_BASE}/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
        headers: { Authorization: PEXELS_KEY },
    });
    return data.photos || [];
};


export const fetchLocalFood = async (cityName) => {
    try {
        const cuisine = CITY_TO_CUISINE[cityName] || cityName;
        const data = await getJSON(
            `${SPOONACULAR_BASE}/recipes/complexSearch?cuisine=${encodeURIComponent(cuisine)}&number=6&addRecipeInformation=false&language=en&apiKey=${SPOONACULAR_KEY}`
        );
        const results = data.results || [];

        return await Promise.all(
            results.map(async (dish) => ({
                ...dish,
                pexelsImg: await fetchFoodPhoto(dish.title),
            }))
        );
    } catch {
        return [];
    }
};

export const fetchFoodDetail = (id) =>
    getJSON(`${SPOONACULAR_BASE}/recipes/${id}/information?apiKey=${SPOONACULAR_KEY}`);

export const searchDestinations = (query) =>
    getJSON(`${OTM_BASE}/places/geoname?name=${encodeURIComponent(query)}&apikey=${OTM_KEY}`);

export const fetchNearbyPlaces = async (lat, lon, radius = 5000) => {
    const data = await getJSON(`${OTM_BASE}/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=20&apikey=${OTM_KEY}`);
    return data.features || [];
};

export const fetchPlaceDetails = (xid) =>
    getJSON(`${OTM_BASE}/places/xid/${xid}?apikey=${OTM_KEY}`);

export const fetchCitySuggestions = async (query) => {
    try {
        const data = await getJSON(
            `${GEOAPIFY_BASE}?text=${encodeURIComponent(query)}&type=city&format=json&apiKey=${GEOAPIFY_KEY}`
        );
        const results = data.results || [];


        const seen = new Set();
        const cities = [];
        for (const r of results) {
            const cityName = r.city || r.formatted;
            if (!cityName || seen.has(cityName)) continue;
            seen.add(cityName);
            cities.push({ city: cityName, country: r.country });
            if (cities.length === 6) break;
        }
        return cities;
    } catch {
        return [];
    }
};

export const FOOD_CITIES = Object.keys(CITY_TO_CUISINE);
export const CITY_REGION = {
    Paris: 'Europe',
    Rome: 'Europe',
    London: 'Europe',
    Amsterdam: 'Europe',
    Lisbon: 'Europe',
    Prague: 'Europe',
    Barcelona: 'Europe',
    Cairo: 'Middle East',
    Dubai: 'Middle East',
    Istanbul: 'Middle East',
    Tokyo: 'Asia',
    Kyoto: 'Asia',
    Bali: 'Asia',
    Bangkok: 'Asia',
    Maldives: 'Asia',
    Sydney: 'Oceania',
    'New York': 'Americas',
};

export const REGION_ORDER = ['All', 'Europe', 'Middle East', 'Asia', 'Oceania', 'Americas'];


const PHOTO_CACHE_PREFIX = 'dest-photo:';

export const getCachedCityPhoto = (city) => {
    try {
        const raw = sessionStorage.getItem(PHOTO_CACHE_PREFIX + city);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const setCachedCityPhoto = (city, image) => {
    try {
        sessionStorage.setItem(PHOTO_CACHE_PREFIX + city, JSON.stringify({ image }));
    } catch {

    }
};


export const fetchCityPhotosProgressively = (cities, onCityLoaded, concurrency = 6) => {
    const pending = [];

    cities.forEach((city) => {
        const cached = getCachedCityPhoto(city);
        if (cached) {
            onCityLoaded(city, { image: cached.image, status: 'done' });
        } else {
            pending.push(city);
        }
    });

    if (pending.length === 0) return () => { };

    let cursor = 0;
    let cancelled = false;

    const runners = Array.from({ length: Math.min(concurrency, pending.length) }, async () => {
        while (cursor < pending.length && !cancelled) {
            const city = pending[cursor++];
            try {
                const photos = await fetchDestinationPhotos(city, 1);
                const image = photos[0]?.src?.large || null;
                if (image) setCachedCityPhoto(city, image);
                if (!cancelled) onCityLoaded(city, { image, status: image ? 'done' : 'error' });
            } catch {
                if (!cancelled) onCityLoaded(city, { image: null, status: 'error' });
            }
        }
    });

    Promise.all(runners);
    return () => { cancelled = true; };
};