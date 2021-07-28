
var currentTitleEl = document.querySelector("#current-title");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var tempEl = document.querySelector("#temp");
var uvEl = document.querySelector(".uv");
var weatherIconEl = document.querySelector("#weather-icon");
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-input");
var searchHistoryEl = document.querySelector("#search-history");
var forecastEl = document.querySelector("#forecast");

//obtain current date
var currentDate = moment().format('l');

//create an array to hold searched city
var cities = ["Toronto"];
// save data in LocalStorage
var searchedCities = [];

// create a default city info
var cityLocation = {
    cityName: "Toronto",
    lat: "43.651070",
    lon: "-79.347015",
}

//retrieve the city name from input
var cityHandler = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    getLatLon(cityName);
    cityFormEl.reset();
}

//handle search history links
var historyLinkHandler = function (event) {
    var cityName = event.target.textContent;
    var lat = event.target.getAttribute("data-lat");
    var lon = event.target.getAttribute("data-lon");
    var cityLocation = {
        cityName: cityName,
        lat: lat,
        lon: lon,
    }
    getForecast(cityLocation);
}

//turn city name into lat & lon
var getLatLon = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=0c623f9105b9300955def28c3a75bb06"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var cityLocation = {
                    cityName: data[0].name,
                    lat: data[0].lat,
                    lon: data[0].lon,
                }
                getForecast(cityLocation);
                searchedCities.push(cityLocation);
                localStorage.setItem("history", JSON.stringify(searchedCities))
            })
        } else {
            alert("Error: Whoops! We can't find what you are looking for.")
        }
    })
};

//fetch forecast data and UVI using onecall API
var getForecast = function (cityLocation) {
    //fetch API
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLocation.lat + "&lon=" + cityLocation.lon + "&exclude=minutely,hourly,alerts&units=metric&appid=0c623f9105b9300955def28c3a75bb06";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var currentData = data.current;
                var forecastData = data.daily;
                displayCurrentWeather(currentData);
                displayForecast(forecastData);
                displayCityName(cityLocation);
            })
        } else {
            alert("Error: Whoops! We can't find what you are looking for.");

        }
    })
        .catch(function (err) {
            alert("Error: Something is wrong with the internet connection.");
        })
};

//display city name in the heading and the search history section
var displayCityName = function (cityLocation) {
    //display city name - heading
    currentTitleEl.textContent = cityLocation.cityName + " " + currentDate;

    //create a history link only if it's new
    if (!cities.includes(cityLocation.cityName)) {
        cities.push(cityLocation.cityName);
        var historyLinkEl = document.createElement("a");
        historyLinkEl.classList = "list-item flex-row justify-space-between align-center";
        historyLinkEl.textContent = cityLocation.cityName;
        historyLinkEl.setAttribute("data-lat", cityLocation.lat);
        historyLinkEl.setAttribute("data-lon", cityLocation.lon);
        searchHistoryEl.appendChild(historyLinkEl);
    }
};

// display current weather
var displayCurrentWeather = function (data) {

    var iconCode = data.weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    var temp = data.temp;
    var wind = data.wind_speed;
    var humidity = data.humidity;

    tempEl.textContent = temp + "°C";
    windEl.textContent = wind + "m/s";
    humidityEl.textContent = humidity + "%";
    weatherIconEl.setAttribute("src", iconUrl);

    //display and colorcode current UVI
    uvEl.textContent = data.uvi;
    switch (true) {
        case (data.uvi < 3):
            uvEl.style.backgroundColor = "#3CB371";
            uvEl.style.color = "white";
            break;
        case (data.uvi < 6):
            uvEl.style.backgroundColor = "#FFD700";
            uvEl.style.color = "#706897";
            break;
        case (data.uvi < 8):
            uvEl.style.backgroundColor = "#FFA500";
            uvEl.style.color = "white";
            break;
        case (data.uvi < 11):
            uvEl.style.backgroundColor = "#FF4500";
            uvEl.style.color = "white";
            break;
        case (data.uvi >= 11):
            uvEl.style.backgroundColor = "#800080";
            uvEl.style.color = "white";
            break;
        default:
            console.log("none");
    }

}

//display 5-day forecast 
var displayForecast = function (forecastData) {
    //clear old content
    forecastEl.textContent = "";

    //loop over forecast data to create daily forecast card
    for (var i = 0; i < forecastData.length - 3; i++) {
        //create daily forecast container
        var dailyForecastEl = document.createElement("div");
        dailyForecastEl.classList = "forecast-card col-12 col-md-2";

        //create date title and append
        var dateFormat = moment(moment().add(i + 1, 'days')).format("l");
        var dateTitleEl = document.createElement("h5");
        dateTitleEl.textContent = dateFormat;
        dailyForecastEl.appendChild(dateTitleEl);

        //create icon and append
        var iconCode = forecastData[i].weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png"
        var iconEl = document.createElement("img");
        iconEl.classList = "icon";
        iconEl.setAttribute("src", iconUrl);
        dailyForecastEl.appendChild(iconEl);

        //create temp and append
        var temp = forecastData[i].temp.day;
        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + temp + "°C";
        dailyForecastEl.appendChild(tempEl);

        //create wind and append
        var wind = forecastData[i].wind_speed;
        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + wind + "m/s";
        dailyForecastEl.appendChild(windEl);

        //create Humidity and append
        var humidity = forecastData[i].humidity;
        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + humidity + "%";
        dailyForecastEl.appendChild(humidityEl);

        //create UVI and append
        var uv = forecastData[i].uvi;
        var uviEl = document.createElement("p");
        uviEl.textContent = "UV Index: ";
        var uvIndexEl = document.createElement("span");
        uvIndexEl.textContent = uv;
        uvIndexEl.classList = ("uvFuture");
        uviEl.appendChild(uvIndexEl);
        dailyForecastEl.appendChild(uviEl);

        //display and colorcode future UVI 
        switch (true) {
            case (uv < 3):
                uvIndexEl.style.backgroundColor = "#3CB371";
                uvIndexEl.style.color = "white";
                break;
            case (uv < 6):
                uvIndexEl.style.backgroundColor = "#FFD700";
                uvIndexEl.style.color = "#706897";
                break;
            case (uv < 8):
                uvIndexEl.style.backgroundColor = "#FFA500";
                uvIndexEl.style.color = "white";
                break;
            case (uv < 11):
                uvIndexEl.style.backgroundColor = "#FF4500";
                uvIndexEl.style.color = "white";
                break;
            case (uv >= 11):
                uvIndexEl.style.backgroundColor = "#800080";
                uvIndexEl.style.color = "white";
                break;
            default:
                console.log("none");
        }
        //append daily forecast card to the container
        forecastEl.appendChild(dailyForecastEl);
    }
}


//load searched cities and display the weather for the last searched cities 
var loadSearchedCities = function () {
    //get data from localStorage
    searchedCities = JSON.parse(localStorage.getItem("history"));
    if (!searchedCities) {
        //display weather condition for a default city if loadStorage is empty
        getForecast(cityLocation);
    } else {
        //display history links
        $.each(searchedCities, function (index, val) {
            var historyLinkEl = document.createElement("a");
            historyLinkEl.classList = "list-item flex-row justify-space-between align-center";
            historyLinkEl.textContent = val.cityName;
            historyLinkEl.setAttribute("data-lat", val.lat);
            historyLinkEl.setAttribute("data-lon", val.lon);
            searchHistoryEl.appendChild(historyLinkEl);
            cities.push(val.cityName);
        })
        //fetch weather data for the last searched city
        getForecast(searchedCities[searchedCities.length - 1]);
    }
}


//load LocalStorage
loadSearchedCities();


// event listener on form
cityFormEl.addEventListener("submit", cityHandler);

//event listener on search history links
searchHistoryEl.addEventListener("click", historyLinkHandler);