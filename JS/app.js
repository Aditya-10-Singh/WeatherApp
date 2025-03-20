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
        getForecast(city);
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

async function getForecast(city) {
    try {
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!forecastResponse.ok) {
            throw new Error('Error fetching forecast');
        }

        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error('Forecast Error:', error);
    }
}

function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = '';

  const forecastList = data.list.filter((item, index) => index % 8 === 0).slice(1, 4);

  forecastList.forEach((forecast) => {
      const iconCode = forecast.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      forecastItem.innerHTML = `
          <h4>${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
          <img src="${iconUrl}" alt="Forecast Icon" />
          <p>🌡️ ${forecast.main.temp}°C</p>
          <p>${forecast.weather[0].description}</p>
      `;
      forecastContainer.appendChild(forecastItem);
  });
}
