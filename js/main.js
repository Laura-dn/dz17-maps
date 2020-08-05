let myMap = {
    lat: 0,
    lng: 0,
    city: '',
    weather: document.querySelector("h2")
}

function initMap() {
    const platform = new H.service.Platform({
        'apikey': '3xG1aah8fW_oXNlO8C1vcD-S3kmfV1qxPCgJyeR-jbA'
    });
    
    const defaultLayers = platform.createDefaultLayers();
    
    const svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 0 25 25" width="35"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2c3.86 0 7 3.14 7 7 0 5.25-7 13-7 13S5 14.25 5 9c0-3.86 3.14-7 7-7zm-1.53 12L17 7.41 15.6 6l-5.13 5.18L8.4 9.09 7 10.5l3.47 3.5z" fill="red"/></svg>';
    
    let icon = new H.map.Icon(svgMarkup),
        coords = { lat: myMap.lat, lng: myMap.lng },
        marker = new H.map.Marker(coords, {icon: icon});

    let map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
            zoom: 12,
        });
    
    map.addObject(marker);
    map.setCenter(coords);
    
    getWeather();
}

function getIP() {
    const url = 'https://www.cloudflare.com/cdn-cgi/trace';
    
    fetch(url).then(resp => resp.text())
        .then(d => parsingData(d));
}

function parsingData(str) {
    let ipInfo = str.split(/\n/gm).reduce((acc, keyVal) => {
        const [key, val] = keyVal.split('=');
        acc[key] = val;
        return acc;
    }, {});
    
    getLocation(ipInfo.ip);
}

function getLocation(ip) {
    const url = 'http://ip-api.com/json/' + ip;
    
    fetch(url).then(resp => resp.json())
        .then(d => {
            myMap.lat = d.lat;
            myMap.lng = d.lon;
            myMap.city = d.city;
            
            initMap();
        });
}

function getWeather() {
    const apiKey = 'ba3fec6b0c23b62fdf797b6e7593dc8a';
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${myMap.lat}&lon=${myMap.lng}&appid=${apiKey}&units=metric`).
        then((resp) => resp.json()).
        then((result) => {
            myMap.weather.innerHTML = `${result.name} - ${Math.round(result.main.temp)} &deg;C`;
        });
}

getIP();

