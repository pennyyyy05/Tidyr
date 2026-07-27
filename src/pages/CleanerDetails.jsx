import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function isTimeAllowed(date, time, availability) {
    if (!date || !time || !availability) return "Please select a date and time";

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[new Date(date + "T00:00:00").getDay()];
    const range = availability[dayName];

    if (!range || range === "Not available") {
        return `Not available on ${dayName}`;
    }

    return true;
}

export default function CleanerDetails() {
    const { id } = useParams();
    const [cleaner, setCleaner] = useState(null);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [confirmed, setConfirmed] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const { user } = useAuth();

    useEffect(() => {
        async function fetchCleaner() {
            try {
                const response = await fetch(`http://localhost/tidyr-api/get_cleaners.php?id=${id}`);
                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || "Cleaner not found");
                    return;
                }

                setCleaner(data);
            } catch (err) {
                setError("Could not load cleaner details");
            }
        }
        fetchCleaner();
    }, [id]);

    async function onSubmit(data) {
        if (!user) {
        setBookingError("You must be logged in to book.");
        return;
        }

        setBookingError("");
        try {
            const response = await fetch("http://localhost/tidyr-api/create_booking.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cleanerId: cleaner.id,
                    name: data.name,
                    contact: data.contact,
                    date: data.date,
                    time: data.time,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setBookingError(result.error || "Could not complete booking");
                return;
            }

            setConfirmed(true);
            setShowForm(false);
        } catch (err) {
            setBookingError("Could not connect to server");
        }
    }

    if (error) {
        return <div className="page container"><h2>{error}</h2></div>;
    }

    if (!cleaner) {
        return <div className="page container"><h2>Loading...</h2></div>;
    }

    return (
        <div className="page container">
            <div className="cleaner-detail">
                <div className="cleaner-detail-image">
                    <img src={cleaner.image} alt={cleaner.name} />
                    <p className="cleaner-detail-rating">⭐ {cleaner.rating} rating</p>
                </div>
                <div>
                    <h1 className="cleaner-detail-name">{cleaner.name}</h1>
                    <p className="cleaner-detail-price">N${cleaner.price}/hour</p>
                    <p className="cleaner-detail-description">{cleaner.bio}</p>

                    <h3>Service Offered</h3>
                    <ul>
                        {cleaner.services?.map((service) => (
                            <li key={service}>{service}</li>
                        ))}
                    </ul>

                    <h3 style={{ marginTop: "1.5rem" }}>Availability</h3>
                    <table className="availability-table">
                        <tbody>
                            {cleaner.availability && Object.entries(cleaner.availability).map(([day, hours]) => (
                                <tr key={day}>
                                    <td>{day}</td>
                                    <td>{hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {confirmed && (
                        <div className="success-message" style={{ marginTop: "1.5rem" }}>
                            Booking confirmed! {cleaner.name} will be notified.
                        </div>
                    )}

                    {!user && !confirmed && (
                        <div className="error-message" style={{ marginTop: "1.5rem" }}>
                            Please <Link to="/auth" className="auth-link">log in or sign up</Link> to book a cleaner.
                        </div>
                    )}

                    {user && !showForm && !confirmed && (
                        <button 
                            className="btn btn-primary btn-large" 
                            style={{ marginTop: "1.5rem" }}
                            onClick={() => setShowForm(true)}
                        >
                            Book
                        </button>
                    )}

                    {showForm && (
                        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "1.5rem" }}>
                            {bookingError && <div className="error-message">{bookingError}</div>}

                            <div className="form-group">
                                <label className="form-label">Your Name</label>
                                <input className="form-input" {...register("name", { required: "Name is required" })} />
                                {errors.name && <span className="form-error">{errors.name.message}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contact</label>
                                <input 
                                    type="tel" 
                                    className="form-input" 
                                    placeholder="e.g. 0811234567"
                                    {...register("contact", { 
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9+\s-]{7,15}$/,
                                            message: "Enter a valid phone number"
                                        }
                                    })} 
                                />
                                {errors.contact && <span className="form-error">{errors.contact.message}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input 
                                        type="date" 
                                        className="form-input" 
                                        min={new Date().toISOString().split("T")[0]}
                                        {...register("date", { 
                                            required: "Date is required",
                                            validate: (value) => isTimeAllowed(value, "00:00", cleaner.availability)
                                        })} 
                                    />
                                    {errors.date && <span className="form-error">{errors.date.message}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Time</label>
                                    <input 
                                        type="time" 
                                        className="form-input time-input" 
                                        {...register("time", { 
                                            required: "Time is required",
                                            validate: (value) => isTimeAllowed(watch("date"), value, cleaner.availability)
                                        })} 
                                    />
                                    {errors.time && <span className="form-error">{errors.time.message}</span>}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary">Confirm Booking</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}