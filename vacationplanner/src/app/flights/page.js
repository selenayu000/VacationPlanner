'use client';
import { useState } from 'react';

export default function flights() {

    const [form, setForm] = useState({
        from: '',
        to: '',
        departureDate: '',
        returnDate: '',
        passengers: 1,
        class: 'Economy',
        type: 'Round Trip',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };
    const handleSearch = () => {
        console.log('Searching with:', form);
    };
    return (
        <main className="flights-page">
            <h1>Flights</h1>
            <div className="flight-filters">
                <select name="type" value={form.type} onChange={handleChange}>
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First</option>
                </select>

                <input name="from" placeholder="📍Leaving From" value={form.from} onChange={handleChange} />
                <input name="to" placeholder="📍Going To" value={form.to} onChange={handleChange} />
                <input name="depart" type="date" value={form.depart} onChange={handleChange} />
                <input name="return" type="date" value={form.return} onChange={handleChange} />

                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="flight-card-row">
                <div className="flight-card">
                    <p>Continue Planning Flights</p>
                </div>
                <div className="flight-card">
                    <p>Flight Deals for Summer</p>
                </div>
            </div>
        </main>
    );
}