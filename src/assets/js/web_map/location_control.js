let userCoords, userAccuracy, userAccuracyCircleMarker, userCoordsMarker

import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'

import L from 'leaflet'

function locationControl(map) {
    let locateControl = L.control.locate({
        enableHighAccuracy: true,
        flyTo: true,
        clickBehavior: {
            inView: 'setView',
        },
        watch: true,
    }).addTo(map)

    locateControl.start()

    map.on('locationfound', onLocationFound)
}

function onLocationFound(e) {
    console.log(e.latlng)
    document.getElementById('p_lat').innerHTML = e.latlng.lat
    document.getElementById('p_lng').innerHTML = e.latlng.lng
}

export { locationControl }