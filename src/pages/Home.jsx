import CleanerCard from "../components/CleanerCard";
import { getCleaners } from "../data/cleaners";
import { Link } from "react-router-dom";

export default function Home() {
    const cleaners = getCleaners(); 

    return (
        <div className="page">
            <div className="home-hero">
                <h1 className="home-title"> Welcome to Tidyr</h1>
                <p className="home-subtitle">Cleaning, made easy.</p>
            </div>
            <div className="container">
                <h2 className="page-title">Find a Cleaner</h2>
                <p className="page-subtitle">Browse our list of professional cleaners and book your next cleaning service with ease.</p>
                <div className="cleaner-grid">
                    {cleaners.map((cleaner) => (
                        <CleanerCard cleaner={cleaner} key={cleaner.id} />
                    ))}
                </div>
            </div>

        </div>
    )
}