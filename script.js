const apiKeyOpenCage = '075c9d92a5c3493c8996975087fa0f88'; // Substitua pela sua chave da OpenCage
let myChart; // Variável global para armazenar a instância do gráfico

function getCoordinates(city, country) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&key=${apiKeyOpenCage}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                return {
                    latitude: data.results[0].geometry.lat,
                    longitude: data.results[0].geometry.lng
                };
            } else {
                throw new Error('Localização não encontrada');
            }
        });
}

function getWeatherData(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m`;

    return fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            return data;
        });
}

function displayWeatherData(weatherData) {
    const currentWeather = weatherData.current_weather;
    document.getElementById('weather-info').innerText = `Temperatura atual: ${currentWeather.temperature}°C, Vento: ${currentWeather.windspeed} km/h`;

    const ctx = document.getElementById('weather-chart').getContext('2d');

    // Se o gráfico já existir, destrua-o
    if (myChart) {
        myChart.destroy();
    }

    // Crie um novo gráfico
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weatherData.hourly.time.slice(0, 24), // Primeiras 24 horas
            datasets: [{
                label: 'Temperatura (°C)',
                data: weatherData.hourly.temperature_2m.slice(0, 24), // Primeiras 24 horas
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById('location-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;

    getCoordinates(city, country)
        .then(coords => {
            return getWeatherData(coords.latitude, coords.longitude);
        })
        .then(weatherData => {
            displayWeatherData(weatherData);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao buscar dados: ' + error.message);
        });
});
