const apiKeyWeather = '84ea6db8f7c9af2bda7dc0ed9228ef70'; // Substitua pela sua chave OpenWeatherMap
const apiKeyGeocode = '075c9d92a5c3493c8996975087fa0f88'; // Substitua pela sua chave OpenCage

document.getElementById('weatherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const country = document.getElementById('country').value;

    try {
        const geocodeResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city},${state},${country}&key=${apiKeyGeocode}`);
        const geocodeData = await geocodeResponse.json();
        const { lat, lng } = geocodeData.results[0].geometry;

        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKeyWeather}&units=metric&lang=pt_br`);
        const weatherData = await weatherResponse.json();

        displayWeather(weatherData);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        document.getElementById('weatherResult').innerHTML = '<p>Erro ao buscar dados. Verifique a cidade, estado e país.</p>';
    }
});

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    const { main, weather } = data;
    const icon = getWeatherIcon(weather[0].main);

    weatherResult.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperatura: ${main.temp}°C</p>
        <p>Condições: ${weather[0].description}</p>
        <img src="${icon}" alt="${weather[0].description}">
    `;
}

function getWeatherIcon(condition) {
    switch (condition) {
        case 'Clear':
            return 'https://img.icons8.com/ios-filled/50/000000/sun.png'; // Ícone de sol
        case 'Rain':
            return 'https://img.icons8.com/ios-filled/50/000000/rain.png'; // Ícone de chuva
        case 'Clouds':
            return 'https://img.icons8.com/ios-filled/50/000000/cloud.png'; // Ícone de nuvens
        case 'Snow':
            return 'https://img.icons8.com/ios-filled/50/000000/snow.png'; // Ícone de neve
        case 'Thunderstorm':
            return 'https://img.icons8.com/ios-filled/50/000000/thunderstorm.png'; // Ícone de tempestade
        default:
            return 'https://img.icons8.com/ios-filled/50/000000/weather.png'; // Ícone padrão
    }
}