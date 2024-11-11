const socket = io()

//Get location, if location not get than show error, refresh location in 5 sec
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
            const {latitude,longitude} = position.coords
            socket.emit("send-location",{latitude,longitude})
        },
        (error)=>{
            console.log(error)
        },
        {
            enableHighAccuracy:true,
            timeout:5000,
            maximumAge:0
        }
    )
}

//Set latitude and longitude default 0,0 and zooming 10
const map = L.map("map").setView([0,0],10)

//Attribution default OpenStreetMap (And add your location name)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);

const markers = {}

//Set latitude and longitude on map
socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data
    map.setView([latitude,longitude])
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map)
    }
})

//when user disconnect than remove from map
socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})