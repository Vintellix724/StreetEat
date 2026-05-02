'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const vendorIconHTML = `
  <div style="background-color: #FF6B00; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">
    <span style="font-size: 16px;">🍲</span>
  </div>
`;

const vendorIcon = L.divIcon({
  html: vendorIconHTML,
  className: 'custom-vendor-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

export default function StaticMapComponent({ location }: { location: [number, number] }) {
  return (
    <div className="w-full h-full pointer-events-none">
      <MapContainer 
        center={location} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        keyboard={false}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={location} icon={vendorIcon} />
      </MapContainer>
    </div>
  );
}
