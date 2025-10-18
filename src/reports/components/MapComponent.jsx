import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  // موقعیت ثابت تهران
  const tehranPosition = [35.6892, 51.3890];

  return (
    <div style={{ height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={tehranPosition}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;