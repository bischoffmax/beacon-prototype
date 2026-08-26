const addBeaconButton = document.getElementById("addBeaconButton");
const locationOutput = document.getElementById("locationOutput");
const savedBeacon = localStorage.getItem("beacon");

if (savedBeacon) {
    const beacon = JSON.parse(savedBeacon);
    locationOutput.textContent = `${beacon.name}: ${beacon.latitude}, ${beacon.longitude}`; 
}

addBeaconButton.addEventListener("click", () => {
    locationOutput.textContent = "Klick erkannt - Standort wird geladen..."

    navigator.geolocation.getCurrentPosition((position) => {
        const beacon = {
            name: "Zelt",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };

        localStorage.setItem("beacon", JSON.stringify(beacon));

        locationOutput.textContent = `${position.coords.latitude}, ${position.coords.longitude}`
    });
});
