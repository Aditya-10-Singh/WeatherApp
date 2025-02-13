let btn = document.getElementById("btn");

async function fetchWeatherData(cityName) {
  const API_KEY = "f58ae87198246a07b383759b4dbebb69";
  const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  try {
    const response = await fetch(apiurl);
    const data = await response.json();

    if (data) {
      const { main, name, weather } = data;
      let city = document.getElementById("city-name");
      let humidity = document.getElementById("humidity");
      let pressure = document.getElementById("pressure");
      let temp = document.getElementById("temperature");
      let desc = document.getElementById("weather-description");
      let icon = document.getElementById("weather-icon");

      city.innerText = `City: ${name}`;
      humidity.innerText = `Humidity: ${main.humidity}%`;
      pressure.innerText = `Pressure: ${main.pressure} hPa`;
      temp.innerText = `Temperature: ${(main.temp - 273.15).toFixed(1)}°C`;
      desc.innerText = `Description: ${weather[0].description}`;

      // Determine image based on weather description
      let weatherCondition = weather[0].main.toLowerCase();

      let weatherImages = {
        clear: "https://cdn-icons-png.flaticon.com/512/869/869869.png", // Sun
        clouds: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png", // Cloud
        rain: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png", // Rain
        drizzle: "https://cdn-icons-png.flaticon.com/512/1163/1163636.png", // Light Rain
        thunderstorm: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png", // Thunder
        snow: "https://cdn-icons-png.flaticon.com/512/4834/4834551.png", // Snow
        mist: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png", // Mist/Fog
      };

      // Set the weather icon based on condition
      icon.src = weatherImages[weatherCondition] || "";
      icon.style.display = weatherImages[weatherCondition] ? "block" : "none";

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
