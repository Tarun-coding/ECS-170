function colorPicked(color) {
    alert(`Picked ${color}`)
}

function sliderChanged(value, scale) {
    //alert(`Selected ${value*scale}`)
    console.log(value*scale)
    return value*scale
}


export {
    colorPicked,
    sliderChanged
}