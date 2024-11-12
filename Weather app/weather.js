const apiKey = '9ce564d01f9532f62b993609c6c475e7';
const baseWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast";

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => resolve(position),   
                error => reject(error)
            );
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}

async function getWeatherByLocation() {
    try {
        const location = await getLocation();
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        const response = await fetch(`${baseWeatherUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        updateWeather(data);
    } catch (error) {
        console.error("Ошибка при получении геолокации:", error);
        alert("Не удалось получить данные погоды по геолокации. Показаны данные по умолчанию.То есть Тараз :)");
        const city = "Taraz";
        const response = await fetch(`${baseWeatherUrl}?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        updateWeather(data);
    }
}

async function checkWeather() {
    const city = document.getElementById('cityInput').value;
    if (city) {
        const response = await fetch(`${baseWeatherUrl}?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        updateWeather(data);
    } else {
        getWeatherByLocation();
    }
}

function updateWeather(data) {
    const currentData = data.list[0];
    const tempElement = document.querySelector('.temp');
    const cityElement = document.querySelector('.city');
    const humidityElement = document.querySelector('.humidity');
    const windElement = document.querySelector('.wind');
    const sunriseElement = document.querySelector('.sunrisee');
    const sunsetElement = document.querySelector('.sunsett');
    const mainWeatherIcon = document.querySelector('.Suret');
    const DesElement = document.querySelector('.Description');

    function formatUnixTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (tempElement && cityElement && humidityElement && windElement && sunriseElement && sunsetElement && mainWeatherIcon) {
        tempElement.textContent = `:  ${currentData.main.temp} °C`;
        cityElement.textContent = `City: ${data.city.name}`;
        humidityElement.textContent = `Humidity: ${currentData.main.humidity}%`;
        DesElement.textContent = `${data.list[0].weather[0].description}`;
        windElement.textContent = `Wind: ${currentData.wind.speed} km/h`;
        


        const sunriseTime = formatUnixTime(currentData.sunrise);
        const sunsetTime = formatUnixTime(currentData.sunset);
        sunriseElement.textContent = `Sunrise: ${sunriseTime}`;
        sunsetElement.textContent = `Sunset: ${sunsetTime}`;

        const mainWeatherIconCode = currentData.weather[0].icon;
        mainWeatherIcon.src = `https://openweathermap.org/img/wn/${mainWeatherIconCode}@2x.png`;
    } else {
        console.error("Некоторые элементы не найдены в DOM.");
    }

    const forecastContainer = document.querySelector('.days5');
    forecastContainer.innerHTML = '';

    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

        const temp = forecast.main.temp;
        const feelsLike = forecast.main.feels_like;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;
        const weatherIcon = forecast.weather[0].icon;

        const forecastHTML = `
            <div class="days">
                <div class="icons">
                    <div class="temperatuuuu">
                        <p class="dow">${dayOfWeek}</p>
                        <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="weather icon" class="main2_suret">
                        <p class="temp1">${temp.toFixed(1)}° C</p>
                    </div>
                </div>
                <div class="on">
                    <div class="feels_like">
                        <p class="lktxt">Feels like</p>
                        <p class="fls_like">${feelsLike.toFixed(1)}° C</p>
                    </div>
                    <div class="humidity1_min">
                        <p class="humtxt">Humidity</p>
                        <p class="hum1">${humidity}%</p>
                    </div>
                    <div class="wind_min">
                        <p class="wtxt">Wind speed</p><p class="wind1">${windSpeed} km/h</p>
                    </div>
                </div>
            </div>
        `;
        forecastContainer.insertAdjacentHTML('beforeend', forecastHTML);
    });
}

getWeatherByLocation();

document.getElementById('cityInput').addEventListener('input', checkWeather);
