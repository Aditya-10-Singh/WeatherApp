let btn = document.getElementById("btn");

async function fetchWeatherData(cityName) {
  const API_KEY = "f58ae87198246a07b383759b4dbebb69";
  const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  try {
    const response = await fetch(apiurl);
    const data = await response.json();
    console.log("Weather Data: ", data);
  } catch (err) {
    console.error("Error fetching Weather Data: ", err);
  }
}

btn.addEventListener("click", () => {
  let cityName = document.getElementById("cityName").value;
  fetchWeatherData(cityName);
});