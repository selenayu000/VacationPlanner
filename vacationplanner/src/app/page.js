'use client';
import Link from 'next/link';
import './globals.css';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./components/map'), { ssr: false });

export default function Home() {
  return (
    <main>
      <header>
        <h1>Welcome to Vacation Planner</h1>
        <p> Plan your perfect trip - flights, stays, activities, and food all in one place !</p>
      </header>

      <div>
        <Map/>
      </div>

      <section className="upcoming-trips">
          <h2>Future Trips!</h2>
          <div className="future-trips-container">
            <div className="trip-card">
              <h3>Trip to Hawaii</h3>
              <p>Dates: June 10 - June 20, 2024</p>
            </div>
          </div>
        </section>
    </main>
  )
}
