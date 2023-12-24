import { locationControl } from './location_control.js'
import { mapInit } from './map_render.js'

const map = mapInit()
locationControl(map)

export { map }