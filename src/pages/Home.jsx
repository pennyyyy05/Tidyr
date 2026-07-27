import {useState, useEffect } from "react";
import CleanerCard from "../components/CleanerCard";
import { Link } from "react-router-dom";

export default function Home() {
    const [cleaners, setCleaners] = useState([]);
    const [error, setError] = useState("");

    const [locationQuery, setLocationQuery] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        async function fetchCleaners() {
            try {
                const response = await fetch("http://localhost/tidyr-api/get_cleaners.php");
                const data = await response.json();
                setCleaners(data);
            } catch (err) {
                setError("Could not load cleaners");
            }
        }
        fetchCleaners();
    }, []);

    const filteredCleaners = cleaners.filter((cleaner) => {
        const matchesLocation = cleaner.location.toLowerCase().includes(locationQuery.toLowerCase());
        const matchesPrice = maxPrice ? cleaner.price <= parseFloat(maxPrice) : true;
        return matchesLocation && matchesPrice;
    });

    return (
        <div className="page">
            <div className="home-hero">
                <h1 className="home-title"> Welcome to <span className="brand-font">Tidyr</span></h1>
                <p> Finding a reliable cleaner shouldn't be a chore of its own. Tidyr connects you with trusted, experienced cleaning professionals in your area — so you can book a spotless home or office in minutes, not hours. Browse verified profiles, compare rates, and schedule a cleaning that fits your life, all in one place</p><br></br>
                <p className="home-subtitle"><span className="brand-font">Tidyr</span>, cleaning made easy.</p>
            </div>
            <div className="container">
                <h2 className="page-title">Find a Cleaner</h2>
                <p className="page-subtitle">Browse our list of professional cleaners and book your next cleaning service with ease.</p>

               <div className="search-bar">
                    <div className="search-input-wrapper">
                        <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by location (e.g. Windhoek)"
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                        />
                    </div>

                    <select
                        className="search-select"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    >
                        <option value="">Any price</option>
                        <option value="100">Below N$100/hr</option>
                        <option value="150">Up to N$150/hr</option>
                        <option value="200">Below N$200/hr</option>
                    </select>
                </div>

                {error && <div className="error-message">{error}</div>}

                {filteredCleaners.length === 0 ? (
                    <p className="page-subtitle">No cleaners available in that location.</p>
                ) : (
                    <div className="cleaner-grid">
                        {filteredCleaners.map((cleaner) => (
                            <CleanerCard cleaner={cleaner} key={cleaner.id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}