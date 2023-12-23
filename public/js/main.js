const JSON_URL = './../public/resource/source.json'

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

    let userLocation
    WORLD_MAP.on('locationfound', (e) => {
        userLocation = [e.latlng.lat, e.latlng.lng]
        return userLocation
    })

    for (const marker in markers) {
        if (markers[marker].active) {

            const markerStatus = markers[marker]['status']
            const markerPayout = markers[marker]['payout']

            console.log(userLocation)
            const userDistance = (WORLD_MAP.distance([0, 0],
              markers[marker].coords) / 1000).toFixed(2)

            /*
             * Pop-up Message builder
             */
            const popupMessage = `<span class="popup-title">Z Scrap Information (#${marker})</span>` +
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

    let lastFetchedAction = 0

    function handleFetchButton (lat, lng) {
        const currentTime = new Date().getTime()
        if (currentTime - lastFetchedAction > 1000) {

            window.open(
              `pages/fetch.html?lat=${lat}&lng=${lng}&b=${config['boundingExpand']}`,
              '_blank')

            lastFetchedAction = currentTime
        }
    }

    /*
     * Handling Popup Event
     */
    WORLD_MAP.on('popupopen', () => {
        setTimeout(function () {
            let fetchButton = document.querySelector('#fetch_enable_btn')
            if (fetchButton) {
                let coords = document.querySelector('.latlng-info').
                  innerHTML.
                  split('|')

                coords = [parseFloat(coords[0]), parseFloat(coords[1])]

                fetchButton.addEventListener('click', function (event) {
                    event.preventDefault()
                    handleFetchButton(coords[0], coords[1])
                    // window.open(
                    //   `pages/fetch.html?lat=${coords[0]}&lng=${coords[1]}&b=${config['boundingExpand']}`,
                    //   '_blank')
                })
            }
        }, 100)

        // L.marker(defaultCoords, { icon: normalMarker }).addTo(WORLD_MAP)

        WORLD_MAP.on('locationerror', (e) => {
            console.log('Error saat mendapatkan lokasi:', e.message)
        })

    }).catch(error => {
        console.error('Error loading JSON:', error)
    })
})


