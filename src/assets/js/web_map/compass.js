function compassInit() {
    const orientationAvailable = 'ondeviceorientationabsolute' in window
    if (orientationAvailable || 'ondeviceorientation' in window) {

    }
    alert(orientationAvailable)
}

compassInit()