import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const App = () => {
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [paths, setPaths] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/cities').then((response) => {
      setCities(response.data);
      // console.log(response.data)
    });
  }, []);

  const handleCityClick = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((selectedCity) => selectedCity !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const findPathsAndShortestPath = () => {
    axios.post('http://localhost:3001/api/paths', { selectedCities }).then((response) => {
      setPaths(response.data);
    });

    axios.post('http://localhost:3001/api/shortest-path', { selectedCities }).then((response) => {
      setShortestPath(response.data);
    });
  };

  return (
    <div>
      <h1>City Path Finder</h1>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[parseFloat(city.lat), parseFloat(city.lon)]}
            eventHandlers={{ click: () => handleCityClick(city) }}
          >
            <Popup>{city.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <div>
        <h2>Selected Cities:</h2>
        <ul>
          {selectedCities.map((city) => (
            <li key={city.id}>{city.name}</li>
          ))}
        </ul>
      </div>
      <button onClick={findPathsAndShortestPath}>Find Paths and Shortest Path</button>
      <div>
        <h2>All Paths:</h2>
        <ul>
          {paths.map((path, index) => (
            <li key={index}>{path.map(city => city.name).join(' -> ')}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Shortest Path:</h2>
        <p>{shortestPath.map(city => city.name).join(' -> ')}</p>
      </div>
    </div>
  );
};

export default App;
