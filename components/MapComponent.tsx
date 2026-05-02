'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issue in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom orange marker for vendors
const vendorIconHTML = `
  <div style="background-color: #FF6B00; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">
    <span style="font-size: 14px;">🍲</span>
  </div>
`;

const vendorIcon = L.divIcon({
  html: vendorIconHTML,
  className: 'custom-vendor-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const userIconHTML = `
  <div style="position: relative; width: 16px; height: 16px;">
    <div style="position: absolute; inset: -4px; border-radius: 50%; background-color: rgba(59, 130, 246, 0.3); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
    <div style="position: absolute; inset: 0; background-color: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
  </div>
  <style>
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .5; transform: scale(1.5); }
    }
  </style>
`;

const userIcon = L.divIcon({
  html: userIconHTML,
  className: 'custom-user-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

interface MapProps {
  userLocation: [number, number];
  vendors: Array<{ id: string; name: string; location: [number, number] }>;
}

function RecenterAutomatically({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapComponent({ userLocation, vendors }: MapProps) {
  return (
    <div className="w-full h-full rounded-[20px] overflow-hidden">
      <MapContainer 
        center={userLocation} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically center={userLocation} />
        
        <Marker position={userLocation} icon={userIcon} />
        
        {vendors.map(vendor => (
          <Marker key={vendor.id} position={vendor.location} icon={vendorIcon}>
            <Popup className="font-dm-sans rounded-xl p-0">
              <div className="font-baloo font-bold text-[#1A1A1A]">{vendor.name}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
