'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

const vendorIconHtml = `
  <div style="
    width: 36px; height: 36px; background-color: #FF6B00; 
    border-radius: 50%; display: flex; align-items: center; 
    justify-content: center; box-shadow: 0 0 0 4px rgba(255, 107, 0, 0.3);
    animation: pulse 2s infinite;
  ">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 17.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5"/>
      <path d="M4 14.5A2.5 2.5 0 0 1 6.5 12h11a2.5 2.5 0 0 1 2.5 2.5"/>
      <path d="M12 12v-6"/>
      <path d="M8 12V3"/>
      <path d="M16 12V8"/>
    </svg>
  </div>
`;

const customerIconHtml = `
  <div style="
    width: 16px; height: 16px; background-color: #4285F4; 
    border: 3px solid white; border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  "></div>
  <div style="
    position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
    background: white; padding: 2px 6px; border-radius: 10px;
    font-size: 10px; font-weight: bold; color: #1A1A1A;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  ">You</div>
`;

const vendorIcon = L.divIcon({
  html: vendorIconHtml,
  className: 'custom-vendor-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const customerIcon = L.divIcon({
  html: customerIconHtml,
  className: 'custom-customer-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

type LiveMapProps = {
  vendorPos: [number, number];
  customerPos: [number, number];
};

export default function LiveMap({ vendorPos, customerPos }: LiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-gray-100" />;

  const center: [number, number] = [
    (vendorPos[0] + customerPos[0]) / 2,
    (vendorPos[1] + customerPos[1]) / 2
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 107, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0); }
        }
      `}} />
      <MapContainer 
        center={center} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline 
          positions={[vendorPos, customerPos]} 
          pathOptions={{ color: '#FF6B00', weight: 4, dashArray: '8, 8' }} 
        />
        <Marker position={vendorPos} icon={vendorIcon} />
        <Marker position={customerPos} icon={customerIcon} />
      </MapContainer>
    </>
  );
}
