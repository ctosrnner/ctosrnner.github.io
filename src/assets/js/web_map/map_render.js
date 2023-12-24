import mapConfig from '../../../map_config.json'

import L from 'leaflet'

import 'leaflet.tilelayer.colorfilter'
import { locationControl } from './location_control.js'
import { map } from './index.js'

function mapInit() {
    const map = L.map('map', { attributionControl: false, maxBoundsViscosity: 0.75 }).
            setView(mapConfig.defaultCoords, mapConfig.defaultZoom).setMaxBounds(mapConfig.maxBounds)

    L.tileLayer.colorFilter(mapConfig.tileLayer.openStreetMaps, {
        minZoom: 8,
        maxZoom: 18,
        filter: [],
    }).addTo(map)

    locationControl(map)

    return map
}

export { mapInit }

