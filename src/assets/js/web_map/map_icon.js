function sourceHtmlIcon() {
    return {
        userLocation: {
            className: `icon userLocation`,
            iconSize: [40, 40],
            iconAnchor: [40 / 2, 40 / 2],
            popupAnchor: [0, 0],
            html: `<div></div>`,
        },
    }
}

function loadHtmlIcon(icon) {
    return L.divIcon({ icon })
}

export { sourceHtmlIcon, loadHtmlIcon }