import L from 'leaflet'

import { mapInit } from './map_render.js'
import { startNavigator } from './user_navigator.js'

const map = mapInit()
startNavigator(map)

export { map }