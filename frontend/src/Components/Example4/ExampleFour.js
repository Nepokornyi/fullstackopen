import React, { useEffect, useState } from 'react'
import { countryInfo, getCountry, convertCityToCoords } from './service'

function ExampleFour() {

    const [searchCountry, setSearchCountry] = useState('');
    const [countryList, setCountryList] = useState([]);
    const [countryName, setCountryName] = useState('')
    const [ready, setReady] = useState(false);
    const [responseData, setResponseData] = useState({
        name: "",
        capital: "",
        area: '',
        languages: [],
        flags: ""
    });
    const [weather, setWeather] = useState({
        temperature: 0,
        wind: 0,
        icon: '',
    })

    useEffect(() => {
        if(searchCountry.length > 1){
            getCountry(searchCountry).then(response => {
                if(response.length === 1){
                    setCountryName(response[0].name.common)
                    setReady(true)
                }
                setCountryList(response)
            });
        }

    },[searchCountry, countryName]);

    useEffect(() => {
        if(ready){
            countryInfo(countryName)
            .then((response) => {
                setResponseData({
                    name: response.name.common,
                    capital: response.capital,
                    area: response.area,
                    languages: Object.entries(response.languages),
                    flags: response.flags
                })
                convertCityToCoords(response.capital).then(response => {
                    setWeather({
                        temperature: response.main.temp,
                        wind: response.wind.speed,
                        icon: response.weather[0].icon,
                    })
                })
                setReady(false)
            });
        }

    }, [ready, countryName]);

    

    const handleSetCountry = (country) => {
        setCountryName(country)
        setReady(true);
    }

    return (
        <div>
            <label htmlFor="country">Find your country</label>
            <input id="country" type="text" value={searchCountry} onChange={(e) => {setSearchCountry(e.target.value)}} />

            {
                countryList.map((country, id) => {
                    return(
                        <div style={{display: 'flex'}} key={id}>
                            <li>{country.name.common}</li> <button onClick={() => handleSetCountry(country.name.common)}>show</button>
                        </div>

                    )
                })
            }
            <div>
                <h1>{responseData.name}</h1>
                <p>capital: {responseData.capital}</p>
                <p>area: {responseData.area}</p>

                <h2>Languages:</h2>
                <ul>
                    {responseData.languages.map((data, id) => {

                        return(
                            <li key={id}>{data[1]}</li>
                        )}
                    )}
                </ul>
                <img src={responseData.flags.png} alt={responseData.flags.alt} />

                <h2>Weather in {responseData.name}</h2>
                <p>temperature: {weather.temperature}</p>
                <img style={{width: '150px', height: '150px'}} src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="" />
                <p>wind: {weather.wind}</p>
            </div>
        </div>
    )
}

export default ExampleFour