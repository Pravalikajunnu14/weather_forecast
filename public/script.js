const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const recentSearches = document.getElementById('recentSearches');

let searches = [];

searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keydown', e => {
    if(e.key === 'Enter') fetchWeather();
});

async function fetchWeather() {
    const city = cityInput.value.trim();
    if (!city) return alert('Please enter a city name');

    try {
        const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
        const data = await res.json();

        if (data.error) {
            weatherResult.innerHTML = `<p>${data.error}</p>`;
            weatherResult.classList.add('visible');
        } else {
            const w = data.data;

            document.getElementById('cityName').textContent = `${w.name}, ${w.sys.country}`;
            document.getElementById('temperature').innerHTML = `<strong>Temperature:</strong> ${w.main.temp} °C`;
            document.getElementById('humidity').innerHTML = `<strong>Humidity:</strong> ${w.main.humidity} %`;
            document.getElementById('wind').innerHTML = `<strong>Wind Speed:</strong> ${w.wind.speed} m/s`;
            document.getElementById('condition').innerHTML = `<strong>Condition:</strong> ${w.weather[0].description}`;

            // Weather icon
            const iconCode = w.weather[0].icon;
            document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherResult.classList.add('visible');

            searches = data.recentSearches;
            updateRecent();
        }
    } catch (err) {
        console.error(err);
        weatherResult.innerHTML = `<p>Error fetching weather data</p>`;
        weatherResult.classList.add('visible');
    }
}

function updateRecent() {
    recentSearches.innerHTML = '';
    searches.slice().reverse().forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => {
            cityInput.value = city.split(',')[0];
            fetchWeather();
        });
        recentSearches.appendChild(li);
    });
}
