const addBeaconButton = document.getElementById("addBeaconButton");
const locationOutput = document.getElementById("locationOutput");
const distanceOutput = document.getElementById("distanceOutput");
const savedBeacon = localStorage.getItem("beacon");
let updateCount = 0;

locationOutput.textContent = "Bitte fügen Sie ein Beacon hinzu."

function toRad(value){
    return value * Math.PI / 180;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
}

// Ist bereits ein Beacon vorhanden?
if (savedBeacon) {
    const beacon = JSON.parse(savedBeacon);

    navigator.geolocation.watchPosition((position) => {
        updateCount++;
        const myLocation = {
            name: "Handy",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }
        
        locationOutput.textContent = 
        `${beacon.name}: ${beacon.latitude}, ${beacon.longitude}`;
       
        distanceOutput.textContent = 
        `Entfernung: ${Math.round(calculateDistance(
            beacon.latitude, 
            beacon.longitude,
            myLocation.latitude,
            myLocation.longitude))} m | Updates ${updateCount}`;
    });
}

// Beacon hinzufuegen
addBeaconButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const beacon = {
            name: "Zelt",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };

        localStorage.setItem("beacon", JSON.stringify(beacon));

        locationOutput.textContent = `${beacon.name} Position: ${beacon.latitude}, ${beacon.longitude}`
    });
});
