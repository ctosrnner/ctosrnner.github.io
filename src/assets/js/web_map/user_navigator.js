let userCoords, userAccuracy, userAccuracyCircleMarker, userCoordsMarker

function startNavigator(map) {
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

        console.log('getCurrent')
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

        console.log(position.coords)
    }

    navigator.geolocation.getCurrentPosition(getSuccessCallback, errorCallback, { enableHighAccuracy: true })
}

export { startNavigator }