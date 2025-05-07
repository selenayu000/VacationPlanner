'use client';

import { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../globals.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function MapClickHandler({ onDrop, dropPinMode, disablePinMode }) {
  useMapEvents({
    click(e) {
      if (dropPinMode) {
        onDrop(e.latlng);
        disablePinMode();
      }
    },
  });
  return null;
}

async function getPlaceName(lat, lng) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await response.json();
  if (data?.address) {
    const { city, town, village, state, country } = data.address;
    return `${city || town || village || 'Unknown'}, ${state || ''}, ${country || ''}`;
  }
  return `Lat: ${lat}, Lng: ${lng}`;
}

async function geocodePlace(query) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=en`
  );
  const data = await response.json();
  if (data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    name: data[0].display_name,
  };
}

function SearchFlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 13, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export default function Map() {
  const [pins, setPins] = useState([]);
  const [dropPinMode, setDropPinMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPosition, setSearchPosition] = useState(null);

  const handleMapClick = async (latlng) => {
    const name = await getPlaceName(latlng.lat, latlng.lng);
    setPins((prev) => [...prev, { ...latlng, name }]);
  };

  const handleSearch = async () => {
    const result = await geocodePlace(searchQuery);
    if (result) {
      const alreadyPinned = pins.some((p) => p.name === result.name);
      if (!alreadyPinned) {
        setPins((prev) => [...prev, result]);
        setSearchPosition(result);
      }
      setSearchQuery('');
    } else {
      alert('Place not found!');
    }
  };

  return (
    <div className="map-wrapper">
      <div className="map-area">
        {/* Absolute UI controls */}
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a place..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <button
          className="pin-button"
          onClick={() => setDropPinMode(true)}
        >
          📍 {dropPinMode ? 'Click on Map!' : 'Drop Pin'}
        </button>

        {/* Leaflet map */}
        <MapContainer
          center={[47.6062, -122.3321]}
          zoom={13}
          className="map-container"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <SearchFlyTo position={searchPosition} />
          <MapClickHandler
            onDrop={handleMapClick}
            dropPinMode={dropPinMode}
            disablePinMode={() => setDropPinMode(false)}
          />
          {pins.map((pos, index) => (
            <Marker key={index} position={[pos.lat, pos.lng]} />
          ))}
        </MapContainer>
      </div>

      <div className="sidebar">
        <h3>Places You've Been!</h3>
        {pins.length === 0 ? (
          <p>No places added yet.</p>
        ) : (
          <ul className="pin-list">
            {pins.map((pin, idx) => (
              <li key={idx}>📍 {pin.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
