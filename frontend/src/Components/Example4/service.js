import axios from "axios"

const countryBaseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name';
const countryAllUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getCountry = (name) => {
    const request = axios.get(countryAllUrl);
    return request.then(response => {
        return response.data.filter(country => country.name.common.toLowerCase().includes(name.toLowerCase()))
    })
}

const countryInfo = (name) => {
    const request = axios.get(`${countryBaseUrl}/${name}`)
    return request.then(response => response.data)
}

export { countryInfo, getCountry }


const weatherAPI = 'fb7d0f8899a2a6aee49bd72511a2d5ce'
const weatherCoordsUrl = 'http://api.openweathermap.org/geo/1.0/direct';
const weatherForecastUrl = 'https://api.openweathermap.org/data/2.5/weather';



const convertCityToCoords = (city) => {
    const request = axios.get(`${weatherCoordsUrl}?q=${city}&appid=${weatherAPI}`)
    return request.then(response => weatherForecast(response.data[0].lat, response.data[0].lon));
}

const weatherForecast = (lat, lon) => {
    const request = axios.get(`${weatherForecastUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAPI}`)
    return request.then(response => response.data)
}


export { convertCityToCoords}