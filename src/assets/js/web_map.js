import mapConfig from '../../../src/map_config.json'

import L from 'leaflet'
import 'leaflet.tilelayer.colorfilter'

function mapInit() {
    const map = L.map('map', { attributionControl: false, maxBoundsViscosity: 0.75 }).
            setView(mapConfig.defaultCoords, mapConfig.defaultZoom).setMaxBounds(mapConfig.maxBounds)

    L.tileLayer.colorFilter(mapConfig.tileLayer, { minZoom: 8, maxZoom: 18 }).addTo(map)
    return map
}

const map = mapInit()

function errorCallback(error) {
    alert(`ERROR(${error.code}): ${error.message}`)
}

function successCallback(position) {
    const userCoords = [position.coords.latitude, position.coords.longitude]
    const userAccuracy = position.coords.accuracy

    let userAccuracyCircleMarker = L.circle(userCoords, { radius: userAccuracy })
    let userCoordsMarker = L.marker(userCoords)

    let indicatorGroup = L.featureGroup([userAccuracyCircleMarker, userCoordsMarker]).addTo(map)
    console.log(indicatorGroup.getBounds())

    map.flyToBounds(indicatorGroup.getBounds())
}

navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true })

