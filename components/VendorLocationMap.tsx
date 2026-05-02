'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

const vendorIconHtml = `
  <div style="
    width: 48px; height: 48px; background-color: #FF6B00; 
    border-radius: 50%; display: flex; align-items: center; 
    justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  ">
    <span style="font-size: 22px;">🛒</span>
  </div>
  <div style="
    width: 0; height: 0; 
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 12px solid #FF6B00;
    margin: -2px auto 0;
  "></div>
`;

const vendorIcon = L.divIcon({
  html: vendorIconHtml,
  className: 'custom-vendor-marker',
  iconSize: [48, 60],
  iconAnchor: [24, 60],
});

type VendorLocationMapProps = {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
};

export default function VendorLocationMap({ position, onPositionChange }: VendorLocationMapProps) {
  const [mounted, setMounted] = useState(false);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          onPositionChange([latLng.lat, latLng.lng]);
        }
      },
    }),
    [onPositionChange],
  );

  if (!mounted) return <div className="h-full w-full bg-[#1C1C2E]" />;

  return (
    <>
       <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container {
          background: #1C1C2E;
        }
        /* Dark mode filter for OSM tiles */
        .leaflet-layer,
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out,
        .leaflet-control-attribution {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}} />
      <MapContainer 
        center={position} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          draggable={true}
          eventHandlers={eventHandlers}
          position={position} 
          icon={vendorIcon}
          ref={markerRef}
        />
        <CircleOverlay position={position} />
      </MapContainer>
    </>
  );
}

function CircleOverlay({ position }: { position: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,107,0,0.1)',
      border: '1px solid rgba(255,107,0,0.3)',
      pointerEvents: 'none',
      zIndex: 1000
    }} />
  );
}
