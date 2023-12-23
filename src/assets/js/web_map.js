import mapConfig from '../../../src/map_config.json'

import L from 'leaflet'
import 'leaflet.tilelayer.colorfilter'

function mapInit() {
    const map = L.map('map', { maxBoundsViscosity: 0.75 }).
            setView(mapConfig.defaultCoords, mapConfig.defaultZoom).setMaxBounds(mapConfig.maxBounds)

    L.tileLayer.colorFilter(mapConfig.tileLayer, {
        minZoom: 8,
        maxZoom: 18,
        filter: [],
        apiKey: 'fa38b65e-c92c-4b90-9aba-651977dda512',
    }).addTo(map)

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

    map.flyToBounds(indicatorGroup.getBounds(), { duration: 1 })
}

navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true })

