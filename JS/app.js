const apiKey = 'f58ae87198246a07b383759b4dbebb69';

async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        document.getElementById('error-message').innerText = 'Please enter a city name!';
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('error-message').innerText = '';
    document.getElementById('weather-info').style.display = 'none';

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);        
        generateSimulatedForecast();
    } catch (error) {
        document.getElementById('error-message').innerText = error.message;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayWeather(data) {
    document.getElementById('city-name').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').innerText = `🌡️ ${data.main.temp}°C`;
    document.getElementById('humidity').innerText = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById('pressure').innerText = `⚡ Pressure: ${data.main.pressure} hPa`;
    document.getElementById('weather-description').innerText = `🌥️ ${data.weather[0].description}`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    document.getElementById('weather-info').style.display = 'block';
}

function generateSimulatedForecast() {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; 

    const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
    const temperatureRange = [-10, 35]; 

    for (let i = 0; i < 3; i++) {
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const temp = (Math.random() * (temperatureRange[1] - temperatureRange[0]) + temperatureRange[0]).toFixed(1);
        const windSpeed = (Math.random() * 20 + 5).toFixed(1); 
        const humidity = (Math.random() * 50 + 50).toFixed(0); 

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <h4>${new Date().toLocaleDateString()}</h4>
            <img src="https://openweathermap.org/img/wn/01d@2x.png" alt="Weather Icon" />
            <p>🌡️ ${temp}°C</p>
            <p>${condition}</p>
            <p>💨 Wind: ${windSpeed} m/s</p>
            <p>💧 Humidity: ${humidity}%</p>
        `;
        forecastContainer.appendChild(forecastItem);
    }
}
