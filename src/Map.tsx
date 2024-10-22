import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'; // Import necessary components from React Leaflet
import L from 'leaflet'; // Leaflet library for maps
import { LatLngTuple } from 'leaflet'; // Type for latitude and longitude tuple
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS for map styling

// Define the structure for an Airport object
type Airport = {
  code: string;
  name: string;
  latitude?: number;
  longitude?: number;
};

// Define the props for the MapView component
type MapViewProps = {
  airportOne: Airport | null; // First selected airport
  airportTwo: Airport | null; // Second selected airport
};

const MapView: React.FC<MapViewProps> = ({ airportOne, airportTwo }) => {
  // If either airport is not selected, return null to prevent rendering
  if (!airportOne || !airportTwo) return null;

  // Calculate the midpoint between the two airports to center the map
  const midpoint: LatLngTuple = [
    (airportOne.latitude! + airportTwo.latitude!) / 2, // Midpoint latitude
    (airportOne.longitude! + airportTwo.longitude!) / 2, // Midpoint longitude
  ];

  // Define the coordinates for the polyline (a line between the two airports)
  const lineCoordinates: LatLngTuple[] = [
    [airportOne.latitude!, airportOne.longitude!], // Coordinates of the first airport
    [airportTwo.latitude!, airportTwo.longitude!], // Coordinates of the second airport
  ];

  // Create a custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // URL to the marker icon
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Anchor point to position the marker correctly
  });

  return (
    // Map container with specified center and zoom level
    <MapContainer center={midpoint} zoom={4} style={{ height: '500px', width: '100%' }}>
      {/* Tile layer from OpenStreetMap to display the map */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL to the OpenStreetMap tiles
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Attribution required by OpenStreetMap
      />

      {/* Marker for the first airport */}
      <Marker position={[airportOne.latitude!, airportOne.longitude!]} icon={markerIcon}>
      </Marker>

      {/* Marker for the second airport */}
      <Marker position={[airportTwo.latitude!, airportTwo.longitude!]} icon={markerIcon}>
      </Marker>

      {/* Polyline to connect the two airports with a blue line */}
      <Polyline positions={lineCoordinates} color="blue" />
    </MapContainer>
  );
};

export default MapView;
