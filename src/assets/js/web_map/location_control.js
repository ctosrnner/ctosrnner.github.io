let userCoords, userAccuracy, userAccuracyCircleMarker, userCoordsMarker

import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'

function locationControl(map) {
    function errorCallback(error) {
        alert(`ERROR(${error.code}): ${error.message}`)
    }

    function getSuccessCallback(position) {
        userCoords = [position.coords.latitude, position.coords.longitude]
        userAccuracy = position.coords.accuracy

        userAccuracyCircleMarker = L.circle(userCoords, { radius: userAccuracy })
        userCoordsMarker = L.marker(userCoords)

        const featureGroup = L.featureGroup([userAccuracyCircleMarker, userCoordsMarker]).addTo(map)
        map.flyToBounds(featureGroup.getBounds())

        navigator.geolocation.watchPosition(watchSuccessCallback, errorCallback, { enableHighAccuracy: true })

        console.log(position)
        updateLocationInformation(position)
    }

    function watchSuccessCallback(position) {
        userCoords = [position.coords.latitude, position.coords.longitude]
        userAccuracy = position.coords.accuracy

        if (userAccuracyCircleMarker || userCoordsMarker) {
            map.removeLayer(userAccuracyCircleMarker)
            map.removeLayer(userCoordsMarker)
        }

        userAccuracyCircleMarker = L.circle(userCoords, { radius: userAccuracy })
        userCoordsMarker = L.marker(userCoords)

        L.featureGroup([userAccuracyCircleMarker, userCoordsMarker]).addTo(map)

        updateLocationInformation(position)
    }

    navigator.geolocation.getCurrentPosition(getSuccessCallback, errorCallback, { enableHighAccuracy: true })
}

function updateLocationInformation(position) {
    let iLat = document.querySelector('#l_lat span')
    let iLng = document.querySelector('#l_lng span')
    let iAcc = document.querySelector('#l_acc span')
    let iHdn = document.querySelector('#l_hdn span')

    const info = position.coords

    iLat.innerHTML = info['latitude'].toString()
    iLng.innerHTML = info['longitude'].toString()
    iAcc.innerHTML = info['accuracy']
    iHdn.innerHTML = info['heading'] ? info['heading'] : '-'
}

export { locationControl }