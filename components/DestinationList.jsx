import DestinationCard from './DestinationCard';

const DestinationList = ({ destinations }) => {
    if (!destinations?.length) return <p className="text-center text-muted mt-4">No destinations found.</p>;

    return (
        <div className="container">
            <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
                {destinations.map(destination => (
                    <DestinationCard key={destination.id} destination={destination} />
                ))}
            </div>
        </div>
    );
};

export default DestinationList;