import mapConfig from '../../../map_config.json'

import 'leaflet.tilelayer.colorfilter'

function mapInit() {
    const map = L.map('map', { attributionControl: false, maxBoundsViscosity: 0.75 }).
            setView(mapConfig.defaultCoords, mapConfig.defaultZoom).setMaxBounds(mapConfig.maxBounds)

    L.tileLayer.colorFilter(mapConfig.tileLayer.openStreetMaps, {
        minZoom: 8,
        maxZoom: 18,
        filter: [],
        apiKey: 'fa38b65e-c92c-4b90-9aba-651977dda512',
    }).addTo(map)

    return map
}

export { mapInit }

