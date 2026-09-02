const addBeaconButton       = document.getElementById("addBeaconButton");
const removeBeaconButton    = document.getElementById("removeBeaconButton");
const distanceOutput        = document.getElementById("distanceOutput");
const availableBeacon       = document.getElementById("availableBeacon");
const directionOutput       = document.getElementById("directionOutput");
const savedBeacon           = localStorage.getItem("beacon");

let updateCount             = 0;

let currentBearing          = null;
let currentHeading          = null;

availableBeacon.textContent = `Please set a Beacon.`

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

function calculateBearing(lat1, lon1, lat2, lon2){
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);
    const dLon = toRad(lon2 - lon1);

    const y = Math.sin(dLon) * Math.cos(lat2Rad);

    const x =
        Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    const bearingRad = Math.atan2(y, x);
    const bearing = bearingRad * 180 / Math.PI;
    const normalizedBearing = (bearing + 360) % 360;

    return normalizedBearing;
}

function startTracking(beacon) {
    navigator.geolocation.watchPosition((position) => {
        updateCount++;

        const myLocation = {
            name: "Handy",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }
        
        currentBearing = calculateBearing(myLocation.latitude, myLocation.longitude, beacon.latitude, beacon.longitude);

        updateDirection();

        distanceOutput.textContent = 
        `${Math.round(calculateDistance(
            beacon.latitude, 
            beacon.longitude,
            myLocation.latitude,
            myLocation.longitude))} m to ${beacon.name}`;
    });
}

function calculateRelativeDirection(bearing, heading) {
    const relativeDirection = ((heading - bearing + 540) %360) - 180;
    
    return relativeDirection;
}

function updateDirection() {
    if(currentBearing !== null && currentHeading !== null) {
        const relativeDirection = calculateRelativeDirection(currentBearing, currentHeading);

        directionOutput.textContent = `${getArrow(relativeDirection)}`;
    }
}

function getArrow(relativeDirection) {
    if (relativeDirection >= -22.5 && relativeDirection <= 22.5) {
        return "⬆️";
    }
    else if (relativeDirection > 22.5 && relativeDirection <= 67.5) {
        return "↗️";
    }
    else if (relativeDirection > 67.5 && relativeDirection <= 112.5) {
        return "➡️";
    }
    else if (relativeDirection > 112.5 && relativeDirection <= 157.5) {
        return "↘️";
    }
    else if (relativeDirection > 157.5) {
        return "⬇️";
    }
    else if (relativeDirection < -22.5 && relativeDirection >= -67.5) {
        return "↖️";
    }
    else if (relativeDirection < -67.5 && relativeDirection >= -112.5) {
        return "⬅️";
    }
    else if (relativeDirection < -112.5 && relativeDirection >= -157.5) {
        return "↙️";
    }
    else {
        return "⬇️";
    }
}

window.addEventListener("deviceorientationabsolute", (event) => {
    if (event.alpha !== null) {
        currentHeading = (360 - event.alpha) % 360;

        updateDirection();
    }
});

// Ist bereits ein Beacon vorhanden?
if (savedBeacon) {
    addBeaconButton.hidden = true;
    removeBeaconButton.hidden = false;

    availableBeacon.textContent = `ⓘ Beacon loaded.`;

    const beacon = JSON.parse(savedBeacon);

    startTracking(beacon);
}
else{
    availableBeacon.textContent = `ⓘ No Beacons set.`

    addBeaconButton.hidden = false;
    removeBeaconButton.hidden = true;
}

// Beacon hinzufuegen
addBeaconButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        addBeaconButton.hidden = true;
        removeBeaconButton.hidden = false;
        
        const beacon = {
            name: "Home",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };

        localStorage.setItem("beacon", JSON.stringify(beacon));

        availableBeacon.textContent = `ⓘ Beacon set.`;

        startTracking(beacon);
    });
});

removeBeaconButton.addEventListener("click", () => {
    localStorage.removeItem("beacon");
    location.reload();
});
