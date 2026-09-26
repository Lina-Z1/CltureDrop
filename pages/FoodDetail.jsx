import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFoodDetail, fetchFoodPhoto } from '../services/api';
import '../styles/FoodDetail.css';

const FoodDetail = () => {
    const { id } = useParams();
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pexelsImg, setPexelsImg] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        setPexelsImg(null);

        fetchFoodDetail(id)
            .then((data) => {
                if (cancelled) return;
                setDish(data);
                setLoading(false);

                fetchFoodPhoto(data.title)
                    .then((img) => { if (!cancelled) setPexelsImg(img); })
                    .catch(() => { });
            })
            .catch(() => {
                if (cancelled) return;
                setError('Something went wrong.');
                setLoading(false);
            });

        window.scrollTo(0, 0);

        return () => { cancelled = true; };
    }, [id]);

    if (loading) return (
        <div className="food-detail-page food-spinner-wrap d-flex justify-content-center align-items-center">
            <div className="spinner-border food-spinner" />
        </div>
    );

    if (error) return (
        <div className="food-detail-page">
            <p className="food-error text-center py-5">{error}</p>
        </div>
    );

    if (!dish) return null;

    return (
        <main className="food-detail-page pb-5">
            <div className="container">
                <section className="food-hero">
                    <div className="food-hero-grid">
                        <div className="food-hero-figure">
                            <img
                                src={pexelsImg || `https://spoonacular.com/recipeImages/${dish.id}-636x393.${dish.imageType}`}
                                alt={dish.title}
                                className="food-hero-circle"
                            />
                        </div>
                        <div>
                            <span className="food-hero-eyebrow">Recipe</span>
                            <h1 className="food-title">{dish.title}</h1>
                            <div className="food-meta-row">
                                {dish.readyInMinutes && (
                                    <span className="food-time-badge">⏱ {dish.readyInMinutes} min</span>
                                )}
                                {dish.vegetarian && <span className="food-badge food-badge-green">🌱 Vegetarian</span>}
                                {dish.vegan && <span className="food-badge food-badge-green">🌿 Vegan</span>}
                                {dish.glutenFree && <span className="food-badge food-badge-yellow">🌾 Gluten free</span>}
                                {dish.servings && <span className="food-badge food-badge-gray">🍽️ {dish.servings} servings</span>}
                            </div>

                            {dish.summary && (
                                <p
                                    className="food-summary"
                                    dangerouslySetInnerHTML={{ __html: dish.summary.slice(0, 500) + '...' }}
                                />
                            )}
                        </div>

                    </div>
                </section>
                {dish.extendedIngredients?.length > 0 && (
                    <section className="food-section">
                        <div className="food-section-head">
                            <h2 className="food-section-title">What you'll need</h2>
                            <span className="food-section-count">{dish.extendedIngredients.length} items</span>
                        </div>
                        <div className="ingredient-grid">
                            {dish.extendedIngredients.map((ing, i) => (
                                <div className="ingredient-card" key={i}>
                                    <div className="ingredient-img-wrap">
                                        <img
                                            src={`https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`}
                                            alt={ing.name}
                                            className="ingredient-img"
                                        />
                                    </div>
                                    <p className="ingredient-name">{ing.name}</p>
                                    <p className="ingredient-amount">
                                        {ing.amount.toFixed(2)} {ing.unit}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {dish.analyzedInstructions?.[0]?.steps?.length > 0 && (
                    <section className="food-section">
                        <div className="food-section-head">
                            <h2 className="food-section-title">Method</h2>
                            <span className="food-section-count">
                                {dish.analyzedInstructions[0].steps.length} steps
                            </span>
                        </div>
                        <div className="steps-timeline">
                            {dish.analyzedInstructions[0].steps.map((step) => (
                                <div key={step.number} className="step-row">
                                    <div className="step-number">{step.number}</div>
                                    <div className="step-card">
                                        <p className="step-text">{step.step}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </main>
    );
};

export default FoodDetail;