const findPaths = (selectedCities) => {
    const paths = [];

    const backtrack = (currentPath, remainingCities) => {
        if (remainingCities.length === 0) {
            paths.push([...currentPath]);
            return;
        }
        for (let i = 0; i < remainingCities.length; i++) {
            const nextCity = remainingCities[i];
            currentPath.push(nextCity);
            const updatedRemainingCities = remainingCities.filter((city) => city !== nextCity);
            backtrack(currentPath, updatedRemainingCities);
            currentPath.pop();
        }
    };

    backtrack([], selectedCities);

    return paths;
};

const findShortestPath = (selectedCities) => {
    const paths = findPaths(selectedCities);
    let shortestPath = [];
    let shortestDistance = Infinity;
    for (const path of paths) {
        let totalDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const city1 = path[i];
            const city2 = path[i + 1];
            const distance = haversine(city1.lat, city1.lon, city2.lat, city2.lon);
            totalDistance += distance;
        }
        if (totalDistance < shortestDistance) {
            shortestDistance = totalDistance;
            shortestPath = path;
        }
    }
    return shortestPath;
};

const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};
const deg2rad = (deg) => deg * (Math.PI / 180);

module.exports = { findPaths, findShortestPath };
