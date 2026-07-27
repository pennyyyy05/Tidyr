import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function AvailabilityRow({ day, register, watch }) {
    const isUnavailable = watch(`${day}.unavailable`);

    return (
        <div className="availability-row">
            <span className="availability-day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>

            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "#666" }}>
                <input type="checkbox" {...register(`${day}.unavailable`)} />
                Unavailable
            </label>

            {!isUnavailable && (
                <>
                    <input type="time" className="form-input" {...register(`${day}.start`)} defaultValue="08:00" />
                    <span className="availability-to">to</span>
                    <input type="time" className="form-input" {...register(`${day}.end`)} defaultValue="16:00" />
                </>
            )}
        </div>
    );
}

const SERVICE_OPTIONS = [
    "House Cleaning",
    "Office Cleaning",
    "Deep Cleaning",
    "Window Cleaning",
    "Move-in/Move-out Cleaning",
];

export default function Admin() {
    const [cleaners, setCleaners] = useState([]);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

    async function fetchCleaners() {
        try {
            const response = await fetch("http://localhost/tidyr-api/get_cleaners.php");
            const data = await response.json();
            setCleaners(data);
        } catch (err) {
            setServerError("Could not load cleaners");
        }
    }

    useEffect(() => {
        fetchCleaners();
    }, []);

    function formatTime(time24) {
        if (!time24) return "";
        const [hour, minute] = time24.split(":").map(Number);
        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
    }

    async function onSubmit(data) {
        setServerError("");
        setSuccessMessage("");

        const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
        const availability = {};

        days.forEach((day) => {
            const d = data[day];
            const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
            availability[dayLabel] = d.unavailable ? "Not available" : `${formatTime(d.start)} - ${formatTime(d.end)}`;
        });

        const payload = {
            name: data.name,
            location: data.location,
            price: parseFloat(data.price),
            rating: parseFloat(data.rating) || 0,
            image: data.image,
            bio: data.bio,
            services: [data.services],
            availability,
        };

        try {
            const response = await fetch("http://localhost/tidyr-api/add_cleaner.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.error || "Could not add cleaner");
                return;
            }

            setSuccessMessage("Cleaner added successfully!");
            reset();
            fetchCleaners();
        } catch (err) {
            setServerError("Could not connect to server");
        }
    }

    return (
        <div className="page container">
            <h1 className="page-title">Admin Panel</h1>

            {serverError && <div className="error-message">{serverError}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="auth-container" style={{ maxWidth: "600px", marginBottom: "3rem" }}>
                <h2>Add a Cleaner</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input className="form-input" {...register("name", { required: "Name is required" })} />
                            {errors.name && <span className="form-error">{errors.name.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input className="form-input" {...register("location", { required: "Location is required" })} />
                            {errors.location && <span className="form-error">{errors.location.message}</span>}
                        </div>
                    </div> 

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Price per hour</label>
                            <input type="number" className="form-input" {...register("price", { required: "Price is required" })} />
                            {errors.price && <span className="form-error">{errors.price.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Picture</label>
                            <input className="form-input" {...register("image")} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea className="form-input" rows="3" {...register("bio")}></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Service Offered</label>
                        <select className="form-input" {...register("services", { required: "Please select a service" })}>
                            <option value="">Select a service</option>
                            {SERVICE_OPTIONS.map((service) => (
                                <option key={service} value={service}>{service}</option>
                            ))}
                        </select>
                        {errors.services && <span className="form-error">{errors.services.message}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Availability</label>
                        {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" ].map((day) => (
                            <AvailabilityRow key={day} day={day} register={register} watch={watch} />
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary">Add Cleaner</button>
                </form>
            </div>

            <div>
                <h2>Existing Cleaners ({cleaners.length})</h2>
                <div className="cleaner-grid">
                    {cleaners.map((cleaner) => (
                        <div className="cleaner-card" key={cleaner.id}>
                            {cleaner.image && <img src={cleaner.image} className="cleaner-card-image" alt={cleaner.name} />}
                            <div className="cleaner-card-content">
                                <h3 className="cleaner-card-name">{cleaner.name}</h3>
                                <p>{cleaner.location} — N${cleaner.price}/hour</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}