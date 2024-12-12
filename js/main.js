document.addEventListener("DOMContentLoaded", () => {
    var menuItems = document.querySelectorAll(".menu-item");
    var currentPath = window.location.pathname; 

    menuItems.forEach(item => {
        const link = item.querySelector("a");
        if (link.getAttribute("href") === currentPath) {
            item.classList.add("current-menu-item");
        } else {
            item.classList.remove("current-menu-item");
        }
    });

    // Hide default index content if it exists
    const defaultIndex = document.getElementById('defaultIndex'); // Assuming this is the ID of the index content
    if (defaultIndex) {
        defaultIndex.style.display = 'none';
    }

    // Load weather data from localStorage on page load
    const storedData = localStorage.getItem('weatherData');
    if (storedData) {
        try {
            const { locationName, allData } = JSON.parse(storedData);
            displayWeather(locationName, allData);
        } catch (error) {
            console.error('Error parsing weather data from localStorage:', error);
            localStorage.removeItem('weatherData'); // Clear invalid data
        }
    } else {
        console.log('No weather data found in localStorage.');
    }
});

// Variables
var searchInput = document.getElementById('searchInput');
var subBtn = document.getElementById('subBtn');
var rowData = document.getElementById('rowData');

// Event Listener for Submit Button
subBtn.addEventListener('click', function (event) {
    event.preventDefault();
    var location = searchInput.value.trim();
    if (location) {
        getAllWeather(location);
    } else {
        console.log('Please enter a location');
    }
});

// Fetch Weather Data
async function getAllWeather(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=94d0ece43cc34d44830225354240812&q=${location}&days=3`);
        if (response.ok) {
            const res = await response.json();
            const allData = res.forecast.forecastday; // Store 3 days of weather data
            console.log('Weather data:', allData);

            // Save to localStorage
            const weatherData = {
                locationName: res.location.name,
                allData
            };
            localStorage.setItem('weatherData', JSON.stringify(weatherData));

            displayWeather(res.location.name, allData); // Pass location name and data for display
        } else {
            console.error('Failed to fetch weather data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(locationName, allData) {
    var cartona = '';
    for (let i = 0; i < allData.length; i++) {
        const weather = allData[i];
        const date = new Date(weather.date);

        cartona += `
            <div class="col-md-4 p-0">
                <div class="card-container text-center">
                    <div class="day"><h4>${date.toLocaleDateString('en-US', { weekday: 'long' })}</h4></div>
                    <div class="date"><h5>${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'long' })}</h5></div>
                    <div class="location-name"><h5>${locationName}</h5></div>
                    <div class="temperature"><h2>${weather.day.avgtemp_c}°C</h2></div>
                    <div class="condition"><p>${weather.day.condition.text}</p></div>
                    <img src="https:${weather.day.condition.icon}" alt="Weather Icon" class="weather-icon">
                </div>
            </div>`;
    }
    rowData.innerHTML = cartona; 
}
