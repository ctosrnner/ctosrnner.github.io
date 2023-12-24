import mapConfig from '../../../map_config.json'

import 'leaflet.tilelayer.colorfilter'
import 'leaflet.motion/dist/leaflet.motion.min.js'

import { locationControl } from './location_control.js'

function mapInit() {
    const map = L.map('map', { attributionControl: false, maxBoundsViscosity: 0.75 }).
            setView(mapConfig.defaultCoords, mapConfig.defaultZoom).setMaxBounds(mapConfig.maxBounds)

    L.tileLayer.colorFilter(mapConfig.tileLayer.openStreetMaps, {
        minZoom: 8,
        maxZoom: 18,
        filter: [],
    }).addTo(map)

    let gridLayer = L.gridLayer({
        tileSize: L.point(100, 100),
        minZoom: 10,
        maxZoom: 18,
    })

    gridLayer.createTile = function (coords) {
        let tile = L.DomUtil.create('div', 'tile-hoverable')

        tile.style.pointerEvents = 'initial'

        return tile
    }

    map.addLayer(gridLayer)

    locationControl(map)

    return map
}

export { mapInit }

