import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material'; // Importing MUI components for autocomplete and text input
import airportData from './filtered_aiport.json'; // Import the JSON file containing airport data

// Define the structure of the airport data based on the JSON file
type AirportData = {
  code: { [key: string]: string }; // Object containing airport codes (e.g., "JFK": "John F. Kennedy International")
  name: { [key: string]: string }; // Object containing airport names corresponding to the codes
};

// Define the structure for an airport (used in the autocomplete dropdown)
type Airport = {
  code: string; // Airport code (e.g., "JFK")
  name: string; // Full name of the airport
};

// Define the props expected by the AirportSearch component
type AirportSearchProps = {
  label: string; // Label to be displayed for the input field
  onAirportSelect: (airport: Airport) => void; // Callback function when an airport is selected
};

const AirportSearch: React.FC<AirportSearchProps> = ({ label, onAirportSelect }) => {
  // State to hold the currently selected airport

  // Explicitly type the JSON file data to match the defined AirportData interface
  const airportDataTyped: AirportData = airportData as AirportData;

  // Convert the data from the JSON file into an array of airport objects
  // Each object contains an airport code and its corresponding name
  const airports = Object.keys(airportDataTyped.code).map((key) => ({
    code: airportDataTyped.code[key], // Get the airport code
    name: airportDataTyped.name[key], // Get the airport name
  }));

  // Event handler triggered when the user selects an airport
  const handleAirportSelect = (event: any, value: Airport | null) => {
    // Update the state with the selected airport
    // If an airport was selected (not null), trigger the callback to the parent component
    if (value) {
      onAirportSelect(value);
    }
  };

  return (
    // Autocomplete component for the airport search input
    <Autocomplete
      options={airports} // The list of airport options generated from the JSON data
      getOptionLabel={(option: Airport) => `${option.name} (${option.code})`} // Display both the name and code of the airport
      onChange={handleAirportSelect} // Handler for when a selection is made
      renderInput={(params) => (
        // Render the input field with a label and standard MUI styling
        <TextField {...params} label={label} variant="outlined" fullWidth />
      )}
    />
  );
};

export default AirportSearch;
