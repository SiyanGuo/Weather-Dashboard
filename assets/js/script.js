// &appid=0c623f9105b9300955def28c3a75bb06
// temp °C
// wind speed meter/sec
// humidity %
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

var currentDate = moment().format('l');

//retrieve the city name
var cityHandler = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim().toUpperCase();
    getCurrentWeather(cityName);
}

//handle history search links
var historyLinkHandler = function (event) {
    var cityName = event.target.textContent;
    getCurrentWeather(cityName)
}

// fetch API to request current weather data
var getCurrentWeather = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=0c623f9105b9300955def28c3a75bb06"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //display current weather & a history link
                displayCurrentWeather(data);
                //display UVI and forecast 
                getForecast(data);
            })
        } else {
            alert("Whoops! We can't find what you are looking for.")
        }
    })
        .catch(function (err) {
            alert("Something is wrong with the internet connection.");
        })
};

//display current weather and a history link
var displayCurrentWeather = function (data) {
    var iconCode = data.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    var cityName = data.name;
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;

    //display a history link
    var historyLinkEl = document.createElement("a");
    historyLinkEl.classList = "list-item flex-row justify-space-between align-center";
    historyLinkEl.textContent = cityName;
    searchHistoryEl.appendChild(historyLinkEl);

    //display current weather
    currentTitleEl.textContent = cityName + " " + currentDate;
    tempEl.textContent = temp + "°C";
    windEl.textContent = wind + "m/s";
    humidityEl.textContent = humidity + "%";
    weatherIconEl.setAttribute("src", iconUrl);
}


//fetch forecast data and UVI
var getForecast = function (data) {

    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=metric&appid=0c623f9105b9300955def28c3a75bb06";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log("APIdata", data);
                var uv = data.current.uvi;
                var forecastData = data.daily;
                uvEl.textContent = uv;
                displayUv(uv);
                displayForecast(forecastData);
            })
        } else {
            alert("Whoops! We can't find what you are looking for.")
        }
    })
        .catch(function (err) {
            alert("Something is wrong with the internet connection.");
        })
};

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
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
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
        var uvi = forecastData[i].uvi;
        var uviEl = document.createElement("p");
        uviEl.textContent = "UV Index: ";
        let uvIndex = document.createElement("span");
        uvIndex.textContent = uvi;
        uvIndex.classList = ("uv");
        uviEl.appendChild(uvIndex);
        dailyForecastEl.appendChild(uviEl);
        // displayUv(uvi);

        //append daily forecast card to the container
        forecastEl.appendChild(dailyForecastEl);
    }
}

//display and color-code UVI 
var displayUv = function (uv) {
    console.log(uv);
    switch (true) {
        case (uv < 3):
            uvEl.style.backgroundColor = "#3CB371";
            uvEl.style.color = "white";
            break;
        case (uv < 6):
            uvEl.style.backgroundColor = "#FFD700";
            uvEl.style.color = "#9088D4";
            break;
        case (uv < 8):
            uvEl.style.backgroundColor = "#FFA500";
            uvEl.style.color = "white";
            break;
        case (uv < 11):
            uvEl.style.backgroundColor = "#FF4500";
            uvEl.style.color = "white";
            break;
        case (uv >= 11):
            uvEl.style.backgroundColor = "#800080";
            uvEl.style.color = "white";
            break;
        default:
            console.log("none");
    }
};

//display the weather condition of a default city
getCurrentWeather("TORONTO");

cityFormEl.addEventListener("submit", cityHandler);
searchHistoryEl.addEventListener("click", historyLinkHandler);