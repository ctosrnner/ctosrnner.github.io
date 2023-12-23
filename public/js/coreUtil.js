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