// Import libraries
import React, { useState } from 'react';
import { Container, Typography, Grid2, Card, CardContent } from '@mui/material';
import AirportSearch from './airport_search'; // Component to handle airport selection from a search bar
import axios from 'axios';
import MapView from './Map'; // Import the MapView component to display the map

// Define the structure for an Airport object
type Airport = {
  code: string;
  name: string;
  latitude?: number;
  longitude?: number;
};

// Function to calculate the distance between two sets of coordinates (latitudes and longitudes)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    
  const R = 3440; // Radius of the Earth in nautical miles

  const toRadians = (degrees: number) => degrees * (Math.PI / 180); // Convert degrees to radians

  // Calculate differences in latitudes and longitudes
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Convert latitudes to radians
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  // Haversine formula to calculate the great-circle distance
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Return the distance in nautical miles
};

function App() {
  // States to store selected airports and calculated distance
  const [distance, setDistance] = useState<number | null>(null);
  const [airportOne, setAirportOne] = useState<Airport | null>(null);
  const [airportTwo, setAirportTwo] = useState<Airport | null>(null);
  const Token = process.env.REACT_APP_GITHUB_PAT;
  

  // Function to fetch airport details like latitude and longitude from the API
  const fetchAirportDetails = async (code: string): Promise<Airport | null> => {
    try {
      const response = await axios.get(`https://airportgap.com/api/airports/${code}`, {
        headers: {
          'Authorization': `Bearer token = ${Token}`, // Authorization header for API
          'Content-Type': 'application/json',
        },
      });
      const data = response.data.data.attributes;
      // Return airport details with the name, latitude, and longitude
      return {
        code,
        name: `${data.name}, ${data.city}, ${data.country}`,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
    } catch (error) {
      console.error('Error fetching airport data:', error);
      return null; // Return null if there's an error fetching data
    }
  };

  // Handle the selection of the first airport
  const handleAirportOneSelect = async (airport: Airport) => {
    const airportDetails = await fetchAirportDetails(airport.code);
    setAirportOne(airportDetails); // Set the first airport's details

    // If both airports are selected, calculate the distance
    if (airportDetails && airportTwo) {
      const dist = calculateDistance(
        airportDetails.latitude!, 
        airportDetails.longitude!, 
        airportTwo.latitude!, 
        airportTwo.longitude!
      );
      setDistance(dist); // Update the distance state
    }
  };

  // Handle the selection of the second airport
  const handleAirportTwoSelect = async (airport: Airport) => {
    const airportDetails = await fetchAirportDetails(airport.code);
    setAirportTwo(airportDetails); // Set the second airport's details

    // If both airports are selected, calculate the distance
    if (airportDetails && airportOne) {
      const dist = calculateDistance(
        airportOne.latitude!, 
        airportOne.longitude!, 
        airportDetails.latitude!, 
        airportDetails.longitude!
      );
      setDistance(dist); // Update the distance state
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // Gradient background
        padding: '20px',
      }} className='App'
    >
      <Container
        maxWidth="md"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Light shadow for a floating effect
        }}
      >
        {/* Title */}
        <Typography variant="h4" align="center" gutterBottom>
          U.S. Airport Distance Calculator
        </Typography>

        {/* Two input fields for selecting airports */}
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            {/* Airport search for the first airport */}
            <AirportSearch label="From Airport" onAirportSelect={handleAirportOneSelect} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            {/* Airport search for the second airport */}
            <AirportSearch label="To Airport" onAirportSelect={handleAirportTwoSelect} />
          </Grid2>
        </Grid2>

        {/* Display selected airports and calculated distance */}
        {airportOne && airportTwo && (
          <Grid2 container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
            {/* Card for the first airport */}
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="center" gutterBottom>
                    From: {airportOne.name}
                  </Typography>
                  <Typography variant="body1" align="center">
                    Latitude: {airportOne.latitude}
                  </Typography>
                  <Typography variant="body1" align="center">
                    Longitude: {airportOne.longitude}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>

            {/* Card for the second airport */}
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="center" gutterBottom>
                    To: {airportTwo.name}
                  </Typography>
                  <Typography variant="body1" align="center">
                    Latitude: {airportTwo.latitude}
                  </Typography>
                  <Typography variant="body1" align="center">
                    Longitude: {airportTwo.longitude}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>

            {/* Display the calculated distance in a separate card */}
            {distance && (
              <Grid2 size={{ xs: 12, md: 10 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" align="center" color="primary" gutterBottom>
                      Distance: {distance.toFixed(2)} nautical miles
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            )}
          </Grid2>
        )}

        {/* Render the map component when both airports are selected */}
        {airportOne && airportTwo && <MapView airportOne={airportOne} airportTwo={airportTwo} />}
      </Container>
    </div>
  );
}

export default App;