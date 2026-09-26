import { Link } from 'react-router-dom';

const FoodCard = ({ dish }) => {
    return (
        <Link to={`/food/${dish.id}`} className="text-decoration-none d-flex flex-column align-items-center">
            <img
                src={dish.pexelsImg || `https://spoonacular.com/recipeImages/${dish.id}-636x393.${dish.imageType}`}
                alt={dish.title}
                className="voy-dish-img"
            />
            <p className="voy-dish-name text-center mt-2 mb-0">{dish.title}</p>
        </Link>
    );
};

export default FoodCard;