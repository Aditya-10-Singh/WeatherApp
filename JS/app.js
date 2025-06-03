function loadFavoriteCities() {
    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    const container = document.getElementById('favorites-list');
    container.innerHTML = '';

    favorites.forEach(city => {
        const cityElem = document.createElement('div');
        cityElem.style.marginBottom = '6px';

        const nameSpan = document.createElement('span');
        nameSpan.innerText = city;
        nameSpan.style.cursor = 'pointer';
        nameSpan.style.marginRight = '10px';
        nameSpan.style.textDecoration = 'underline';
        nameSpan.onclick = () => getWeather(city);

        const removeBtn = document.createElement('button');
        removeBtn.innerText = '❌';
        removeBtn.style.cursor = 'pointer';
        removeBtn.onclick = () => removeFavoriteCity(city);

        cityElem.appendChild(nameSpan);
        cityElem.appendChild(removeBtn);
        container.appendChild(cityElem);
    });
}

function addFavoriteCity() {
    if (!lastCity) {
        showError("No city selected to add to favorites.");
        return;
    }

    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    if (!favorites.includes(lastCity)) {
        favorites.push(lastCity);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        loadFavoriteCities();
    } else {
        showError("City already in favorites.");
    }
}

function removeFavoriteCity(city) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    favorites = favorites.filter(c => c !== city);
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    loadFavoriteCities();
}

window.onload = function () {
    loadFavoriteCities();
};

const apiKey = 'f58ae87198246a07b383759b4dbebb69';

let isFahrenheit = false;
let lastWeatherData = null;
let lastCity = '';
let lastCoords = null;

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function cToF(tempC) {
    return ((tempC * 9/5) + 32).toFixed(1);
}

function showError(message) {
    document.getElementById('error-message').innerText = message;
}

function resetDisplay() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error-message').innerText = '';
    document.getElementById('weather-info').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function toggleTemperatureUnit() {
    isFahrenheit = !isFahrenheit;
    document.getElementById('toggle-label').innerText = isFahrenheit ? 'Show °C' : 'Show °F';

    if (navigator.vibrate) {
        navigator.vibrate(100);
    }

    if (lastWeatherData) {
        displayWeather(lastWeatherData);
    }

    if (lastCity) {
        getForecast(lastCity);
    } else if (lastCoords) {
        getForecast(lastWeatherData.name); 
    }
}

function refreshWeather() {
    if (lastCoords) {
        getWeatherByCoords(lastCoords.latitude, lastCoords.longitude, false);
    } else if (lastCity) {
        getWeather(lastCity, false);
    } else {
        showError('No previous location to refresh.');
    }
}

async function getWeather(cityInput = null, updateLastCity = true) {
    const city = cityInput ?? document.getElementById('city').value.trim();
    if (!city) {
        showError('Please enter a city name!');
        return;
    }

    if (updateLastCity) lastCity = city;
    lastCoords = null;

    resetDisplay();

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        displayWeather(data);
        getForecast(city);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function getWeatherByCoords(lat, lon, update = true) {
    if (update) {
        lastCoords = { latitude: lat, longitude: lon };
        lastCity = '';
    }

    resetDisplay();

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('Location-based weather not found');

        const data = await response.json();
        displayWeather(data);
        getForecast(data.name);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function getWeatherByGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser.');
        return;
    }

    resetDisplay();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            lastCoords = { latitude: lat, longitude: lon };  
            lastCity = ''; 
            await getWeatherByCoords(lat, lon, false);  
        },
        () => {
            showError('Location access denied.');
            hideLoading();
        }
    );
}

function displayWeather(data) {
    lastWeatherData = data;
    document.getElementById('city-name').innerText = `${data.name}, ${data.sys.country}`;
    const tempC = data.main.temp;
    const temp = isFahrenheit ? cToF(tempC) : tempC.toFixed(1);
    const unit = isFahrenheit ? '°F' : '°C';
    document.getElementById('temperature').innerText = `🌡️ ${temp}${unit}`;
    document.getElementById('humidity').innerText = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById('pressure').innerText = `⚡ Pressure: ${data.main.pressure} hPa`;
    document.getElementById('weather-description').innerText = `🌥️ ${capitalize(data.weather[0].description)}`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    document.getElementById('weather-info').style.display = 'block';
}

async function getForecast(city) {
    try {
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!forecastResponse.ok) throw new Error('Error fetching forecast');

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
        const forecastDate = new Date(forecast.dt_txt);
        const day = forecastDate.toLocaleDateString(undefined, { weekday: 'long' });
        const date = forecastDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        const tempC = forecast.main.temp;
        const temp = isFahrenheit ? cToF(tempC) : tempC.toFixed(1);
        const unit = isFahrenheit ? '°F' : '°C';

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <h4>${day}, ${date}</h4>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Forecast Icon" />
            <p>🌡️ ${temp}${unit}</p>
            <p>${capitalize(forecast.weather[0].description)}</p>
            <p>🌬️ Wind: ${forecast.wind.speed} m/s</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
