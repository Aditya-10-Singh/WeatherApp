let btn = document.getElementById("btn");

async function fetchWeatherData(cityName) {
  const API_KEY = "f58ae87198246a07b383759b4dbebb69";
  const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  try {
    const response = await fetch(apiurl);
    const data = await response.json();

    if (data) {
      const { main, name, weather, wind } = data;
      let city = document.getElementById("city-name");
      let humidity = document.getElementById("humidity");
      let pressure = document.getElementById("pressure");
      let temp = document.getElementById("temperature");
      let desc = document.getElementById("weather-description");

      city.innerText = `City: ${name}`;
      humidity.innerText = `Humidity: ${main.humidity}%`;
      pressure.innerText = `Pressure: ${main.pressure} hPa`;
      temp.innerText = `Temperature: ${main.temp} K`;
      desc.innerText = `Description: ${weather[0].description}`;
    } else {
      console.log("No Data Found!");
    }
  } catch (err) {
    console.error("Error fetching Weather Data: ", err);
  }
}

btn.addEventListener("click", () => {
  let cityName = document.getElementById("cityName").value;
  fetchWeatherData(cityName);
});
