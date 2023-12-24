import { sourceHtmlIcon } from './map_icon.js'

let userCoords, userAccuracy, userAccuracyCircleMarker, userCoordsMarker

import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'

function locationControl(map) {
    function errorCallback(error) {
        alert(`ERROR(${error.code}): ${error.message}`)
    }

    function getSuccessCallback(position) {
        console.log(sourceHtmlIcon().userLocation)
        userCoords = [position.coords.latitude, position.coords.longitude]
        userAccuracy = position.coords.accuracy

        userAccuracyCircleMarker = L.circle(userCoords, {
            opacity: userAccuracy < 15 ? 0.0 : 1.0,
            fillOpacity: userAccuracy < 15 ? 0.0 : 0.25,
            radius: userAccuracy,
        })
        userCoordsMarker = L.marker(userCoords, {
            icon: L.divIcon(sourceHtmlIcon().userLocation),
        })

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
            userAccuracyCircleMarker.setLatLng(userCoords).setRadius(userAccuracy)
            userCoordsMarker.setLatLng(userCoords)

            userAccuracyCircleMarker.setOpacity(userAccuracy < 15 ? 0.0 : 1.0)
        }

        updateLocationInformation(position)
    }

    navigator.geolocation.getCurrentPosition(getSuccessCallback, errorCallback, { enableHighAccuracy: true })
}

function updateLocationInformation(position) {
    let iLat = document.querySelector('#l_lat span')
    let iLng = document.querySelector('#l_lng span')
    let iAcc = document.querySelector('#l_acc span')

    const info = position.coords

    iLat.innerHTML = info['latitude'].toString()
    iLng.innerHTML = info['longitude'].toString()
    iAcc.innerHTML = info['accuracy']
}

export { locationControl }