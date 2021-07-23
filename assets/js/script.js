// &appid=0c623f9105b9300955def28c3a75bb06
// temp °C
// wind speed meter/sec
// humidity %
var currentTitleEl = document.querySelector("#current-title");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var tempEl = document.querySelector("#temp");
var uvEl = document.querySelector("#uv");
var weatherIconEl = document.querySelector("#weather-icon");

var cityName = "toronto";
var getCurrentWeather = function (cityName) {
    // event.preventDefault();
    cityName = cityName.toUpperCase();
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=0c623f9105b9300955def28c3a75bb06"
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var iconCode = data.weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
                var temp = data.main.temp;
                var wind = data.wind.speed;
                var humidity = data.main.humidity;
                console.log(data);
                var city = {
                    lat: data.coord.lat,
                    lon: data.coord.lon
                }
                var cityWeather = {
                    name: cityName,
                    icon: iconUrl,
                    temp: temp,
                    wind: wind,
                    humidity: humidity
                }
                console.log(cityWeather);
                displayCurrentWeather(cityWeather);
                fetchOneCall(city);
            })
        } else {
            alert("request not successful!")
        }
    })
};


var displayCurrentWeather = function (cityWeather) {
    var currentDate = moment().format('l');
    currentTitleEl.textContent = cityWeather.name + " " + currentDate;
    tempEl.textContent = cityWeather.temp + "°C";
    windEl.textContent = cityWeather.wind + "m/s";
    humidityEl.textContent = cityWeather.humidity + "%";
    weatherIconEl.setAttribute("src", cityWeather.icon);
}

var fetchOneCall = function (city) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + city.lat + "&lon=" + city.lon + "&exclude=minutely,hourly,alerts&appid=0c623f9105b9300955def28c3a75bb06"

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log("oneCall", data);
                var uv = data.current.uvi;
                displayUv(uv);
            })
        } else {
            alert("your request failed")
        }
    })
};


var displayUv = function (uv) {
    uvEl.textContent = uv;
    switch (true) {
        case (uv < 3):
            uvEl.style.backgroundColor = "#3CB371";
            uvEl.style.color = "white";
            break;
        case (uv < 6):
            uvEl.style.backgroundColor = "#FFD700";
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
    }


};
getCurrentWeather(cityName)