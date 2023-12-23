const JSON_URL = './../public/resource/source.json'

/*
 * Get the coordinate bounding box
 */
function getCoordsBounding (lat, lon, boundingExpand) {
    return [
        [lat - boundingExpand, lon + boundingExpand],
        [lat + boundingExpand, lon + boundingExpand],
        [lat + boundingExpand, lon - boundingExpand],
        [lat - boundingExpand, lon - boundingExpand],
    ]
}

function isInsideBoundingBox (point, boundingBox) {
    const [x, y] = point
    const [x1, y1] = boundingBox[0]
    const [x2, y2] = boundingBox[1]
    const [x3, y3] = boundingBox[2]
    const [x4, y4] = boundingBox[3]

    const isInsideX = x >= Math.min(x1, x2, x3, x4) && x <=
      Math.max(x1, x2, x3, x4)
    const isInsideY = y >= Math.min(y1, y2, y3, y4) && y <=
      Math.max(y1, y2, y3, y4)

    return isInsideX && isInsideY
}

fetch(JSON_URL).then(response => {
    if (!response.ok) {
        console.log('error')
    }
    return response.text()
}).then(jsonData => {
    /*
     * Application Cores
     */
    const JSON_OBJECT = JSON.parse(jsonData)

    const { config } = JSON_OBJECT
    const { markers } = JSON_OBJECT

    const { defaultCoords } = config
    const { defaultZoom } = config

    const WORLD_MAP = L.map('render_map', { minZoom: 8, maxZoom: 18 }).
      setView(defaultCoords, defaultZoom).setMaxBounds(config.maxBounds)

    /*
    * Rendering Map Image/Tiles
    */
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
    }).addTo(WORLD_MAP)

    /*
    * Adding show location Control
    */
    let locateControl = L.control.locate(
      {
          flyTo: true,
          strings: { title: 'Center Your Position' },
          clickBehavior: {
              inView: 'setView',
              outOfView: 'setView',
              inViewNotFollowing: 'setView',
          },
      }).
      addTo(WORLD_MAP)

    locateControl.start()

    /*
    * Registering custom Icon
    */
    let mainMarker = L.Icon.extend({
        options: {
            popupAnchor: [0, -17.5],
            iconSize: [35, 35],
            iconAnchor: [17.5, 17.5],
        },
    })

    let warnMarker = new mainMarker(
      { iconUrl: './../public/img/icon/dmarker_warn.png' })
    let normalMarker = new mainMarker(
      { iconUrl: './../public/img/icon/dmarker_normal.png' })

    WORLD_MAP.on('locationfound', (e) => {
        let userLocation = [e.latlng.lat, e.latlng.lng]

        for (const marker in markers) {
            if (markers[marker].active) {

                const markerStatus = markers[marker]['status']
                const markerPayout = markers[marker]['payout']

                const userDistance = (WORLD_MAP.distance(userLocation,
                  markers[marker].coords) / 1000).toFixed(2)

                /*
                 * Pop-up Message builder
                 */
                const popupMessage = `<span class="popup-title">Scrap Information (#${marker})</span>` +
                  `<span>Distance: ${userDistance}km</span>` +
                  `<span class="popup-status ${markerStatus
                    ? 'avn'
                    : 'unv'}">${markerStatus
                    ? 'Available'
                    : 'Unavailable'} <span class="popup-payout ${markerStatus
                    ? ''
                    : 'unv'}">IDR ${markerPayout}</span></span>` +
                  `<div><button id="${markerStatus
                    ? 'fetch_enable_btn'
                    : ''}" type="button" class="popup-button-fetch ${markerStatus
                    ? ''
                    : 'unv'}">Fetch</button></div>` +
                  `<span class="latlng-info hidden">${markers[marker].coords[0]}|${markers[marker].coords[1]}</span>`

                L.polygon(getCoordsBounding(markers[marker].coords[0],
                  markers[marker].coords[1], config['boundingExpand'])).
                  addTo(WORLD_MAP)

                L.marker(markers[marker].coords,
                  { icon: markerStatus ? normalMarker : warnMarker }).
                  addTo(WORLD_MAP).
                  bindPopup(popupMessage)

                let { boundingExpand } = config

                L.circle(markers[marker].coords, {
                    color: markerStatus ? '#3b73cc' : '#db3e3e',
                    fillColor: markerStatus ? '#3b73cc' : '#db3e3e',
                    fillOpacity: 0.35,
                    radius: (boundingExpand * 112500),
                }).addTo(WORLD_MAP)
            }

        }

        let fetchButton
        /*
         * Handling Popup Event
         */
        WORLD_MAP.on('popupopen', () => {
            console.log('popup OPEN')
            setTimeout(function () {

                fetchButton = document.querySelector('#fetch_enable_btn')
                if (fetchButton) {
                    let coords = document.querySelector('.latlng-info').
                      innerHTML.
                      split('|')

                    coords = [parseFloat(coords[0]), parseFloat(coords[1])]

                    fetchButton.addEventListener('click', (event) => {
                        event.preventDefault()
                        let latLng = [userLocation[0], userLocation[1]]
                        let result = isInsideBoundingBox(latLng,
                          getCoordsBounding(coords[0], coords[1],
                            config['boundingExpand']))

                        if (result) {
                            alert('Success Fetching')
                        } else {
                            alert('Failed to- fetch...')
                        }
                        WORLD_MAP.closePopup()
                    })
                }

            }, 100)
        })
    })

    // L.marker(defaultCoords, { icon: normalMarker }).addTo(WORLD_MAP)

    WORLD_MAP.on('locationerror', (e) => {
        console.log('Error saat mendapatkan lokasi:', e.message)
    })

}).catch(error => {
    console.error('Error loading JSON:', error)
})


