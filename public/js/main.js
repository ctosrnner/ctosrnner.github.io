let expand = 0.00400

function createBounding (lat, lon) {
    return [
        [lat - expand, lon + expand],
        [lat + expand, lon + expand],
        [lat + expand, lon - expand],
        [lat - expand, lon - expand],
    ]
}

console.log(createBounding(-7.30052, 110.45507))