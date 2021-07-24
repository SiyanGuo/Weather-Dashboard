
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
var cityLocation = {
    cityName: "Toronto",
    lat:"43.651070",
    lon:"-79.347015"
}

//retrieve the city name
var cityHandler = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    console.log(cityName);
    getLatLon(cityName);
    cityFormEl.reset();
}

//handle history search links
var historyLinkHandler = function (event) {
    var cityName = event.target.textContent;
    var lat = event.target.getAttribute("data-lat");
    var lon = event.target.getAttribute("data-lon");
    var cityLocation = {
        cityName: cityName,
        lat: lat,
        lon: lon,
        history:true
    }
    getForecast(cityLocation);
}

var getLatLon = function (cityName) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=0c623f9105b9300955def28c3a75bb06"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                var cityLocation = {
                    cityName: data[0].name,
                    lat: data[0].lat,
                    lon: data[0].lon
                }
                getForecast(cityLocation)
            })
        } else {
            alert("Whoops! We can't find what you are looking for.")
        }
    })
}

// fetch API to request current weather data
// var getCurrentWeather = function (cityName) {
//     var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=0c623f9105b9300955def28c3a75bb06"
//     fetch(apiUrl).then(function (response) {
//         if (response.ok) {
//             response.json().then(function (data) {
//                 //display current weather & a history link
//                 displayCurrentWeather(data);
//                 //display UVI and forecast 
//                 getForecast(data);
//             })
//         } else {
//             alert("Whoops! We can't find what you are looking for.")
//         }
//     })
//         .catch(function (err) {
//             alert("Something is wrong with the internet connection.");
//         })
// };


//fetch forecast data and UVI
var getForecast = function (cityLocation) {
    displayCityName(cityLocation);
    //fetch API
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLocation.lat + "&lon=" + cityLocation.lon + "&exclude=minutely,hourly,alerts&units=metric&appid=0c623f9105b9300955def28c3a75bb06";
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log("APIdata", data);
                var currentData = data.current;
                var uv = data.current.uvi;
                var forecastData = data.daily;
                displayCurrentWeather(currentData);
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

var displayCityName = function (cityLocation){
    //display city name - heading
    currentTitleEl.textContent = cityLocation.cityName + " " + currentDate;

    //create a history link if it's new
    if(!cityLocation.history){
        var historyLinkEl = document.createElement("a");
        historyLinkEl.classList = "list-item flex-row justify-space-between align-center";
        historyLinkEl.textContent = cityLocation.cityName;
        historyLinkEl.setAttribute("data-lat", cityLocation.lat);
        historyLinkEl.setAttribute("data-lon", cityLocation.lon);
        searchHistoryEl.appendChild(historyLinkEl);
    }
}

// display current weather
var displayCurrentWeather = function (data) {

    var iconCode = data.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    var temp = data.temp;
    var wind = data.wind_speed;
    var humidity = data.humidity;

    //display current weather
    tempEl.textContent = temp + "°C";
    windEl.textContent = wind + "m/s";
    humidityEl.textContent = humidity + "%";
    weatherIconEl.setAttribute("src", iconUrl);
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
        var uv = forecastData[i].uvi;
        var uviEl = document.createElement("p");
        uviEl.textContent = "UV Index: ";
        var uvIndexEl = document.createElement("span");
        uvIndexEl.textContent = uv;
        uvIndexEl.classList = ("uvFuture");
        uviEl.appendChild(uvIndexEl);
        dailyForecastEl.appendChild(uviEl);

        //display and color-code future UVI 
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

//display and color-code current UVI 
var displayUv = function (uv) {
    console.log(uv);
    uvEl.textContent = uv;
    switch (true) {
        case (uv < 3):
            uvEl.style.backgroundColor = "#3CB371";
            uvEl.style.color = "white";
            break;
        case (uv < 6):
            uvEl.style.backgroundColor = "#FFD700";
            uvEl.style.color = "#706897";
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


//get user's location
getForecast(cityLocation);

cityFormEl.addEventListener("submit", cityHandler);
searchHistoryEl.addEventListener("click", historyLinkHandler);