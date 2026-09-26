import { Link } from 'react-router-dom';

const DestinationCard = ({ destination }) => {
    const { name, image, description } = destination;

    return (
        <Link to={`/destinations/${encodeURIComponent(name)}`} className="text-decoration-none">
            <div className="col">
                <div className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-4 shadow-lg"
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '400px'
                    }}>
                    <div className="d-flex flex-column h-100 p-5 pb-3 text-white" style={{ background: 'rgba(0,0,0,0.4)' }}>
                        <div className="pt-5 mt-5 mb-4">
                            <h2 className="display-6 lh-1 fw-bold text-center">{name}</h2>
                            <p className="mt-2">{description || `Explore the beautiful ${name}`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default DestinationCard;