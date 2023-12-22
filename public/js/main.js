const successCallback = (position) => {
    // let lat = position.coords.latitude.toString()
    // let lon = position.coords.longitude.toString()

    // -7.3510877, 110.50685

    let lat = -7.34997
    let lon = 110.50804

    const apiEndpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&address details=1`

    let isInsideBoundingBox

    fetch(apiEndpoint).
      then((response) => response.json()).
      then((data) => {
          console.log(data)

          isInsideBoundingBox =
            lat >= boundingBox.minLat &&
            lat <= boundingBox.maxLat &&
            lon >= boundingBox.minLon &&
            lon <= boundingBox.maxLon
      })

    console.log(isInsideBoundingBox)
}

const boundingBox = {
    minLat: -7.3895168,
    maxLat: -7.3505255,
    minLon: 110.4781764,
    maxLon: 110.5072012,
}

const errorCallback = (error) => {
    console.log(error)
}

navigator.geolocation.getCurrentPosition(successCallback, errorCallback)