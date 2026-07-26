import { Link } from "react-router-dom";

export default function CleanerCard({ cleaner }) {
    return (
        <div className="cleaner-card" >
            <img src={cleaner.image} alt={cleaner.name} className="cleaner-card-image" />
            <div className="cleaner-card-content">
                <h3 className="cleaner-card-name">{cleaner.name}</h3>
                <p className="cleaner-card-price">N${cleaner.price}/hour </p>
                <p className="cleaner-card-location">{cleaner.location}</p>
                <p className="cleaner-card-rating">Rating: {cleaner.rating}</p>
                <div className="cleaner-card-actions">
                    <Link to={`/cleaners/${cleaner.name}`}>Book Now</Link>
                </div>
            </div>
        </div>
    );
}