import { useEffect } from 'react';
import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

const { MapContainer, Popup, TileLayer, Marker } = ReactLeaflet;

const position = [51.505, -0.09] 
export default function About() {
  return (
  <div>
    <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  </div>

  )
}
