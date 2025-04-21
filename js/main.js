"use strict"
// *current location
function findCurrentLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition , showError);
    }else{
        alert("your browser doesn't support the location")
    }
}


//*in case of sucess callback
function showPosition(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    getWeather(lat , lon) // to API
}
//* in case of error callback
function showError(){
    alert("can't get your location")
}


//* Call API to get the Weather
async function getWeather(parameter1 , parameter2){
    let query = " "
    if(typeof parameter1 === "string"){
        query = parameter1 //city
    }else{
        query = `${parameter1} , ${parameter2}` // lat , lon
    }
    try{
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=926c5e7a6826415ab2c151744251504&&q=${query}&days=3`)
        if(response.ok == true){
            let data = await response.json()
            console.log(data);
            displayWeather( data.location , data.forecast.forecastday , data.current)
    }
    }catch(error){
        alert("Something went wrong. Please try again.");
    }

}

//?====================================================

// *search city
document.querySelector('.searchForm').addEventListener('submit',function(event){
    event.preventDefault()
    searchCity();
})


function searchCity(){
    let searchInput = document.getElementById('searchInput')
    let city = searchInput.value.trim();
    if( city === ""){
        alert('Please enter city name')
        return
    }else{
        getWeather(city)
    }

}

// ?====================================================

let rowData = document.getElementById('rowData')

function displayWeather(location, forecastDays , current){
    let date = new Date(current.last_updated);
    let fullDate = convertDate(date);

    let cartona = ``
    
    //!for current climate 
    cartona+=`
                        <div class="col-sm-12 col-md-4 mb-4 mt-5 weatherCard">
                            <div class="mainCard position-relative">
                                <div class="baseCard p-3 text-center">
                                <div><h4 class="date">${fullDate}</h4></div>
                                    <img src="https:${current.condition.icon}" class="myImg mx-auto d-block" alt="sunny">
                                    <div class="temp">${current.temp_c}°C</div>
                                    <div class="country">${location.name}, ${location.country}</div>
                                    <small class="status text-primary">${current.condition.text}</small>
                                </div>
                                <div class="secCard p-3">
                                    <div class="upper d-flex justify-content-between">
                                        <div class="humidity text-center">
                                            <img src="./images/humidiy.png" class="climateIcon">
                                            <div class="humText">Humidity <br> ${current.humidity}</div>
                                        </div>
                                        <div class="wind text-center">
                                            <img src="./images/wind.png" class="climateIcon">
                                            <div class="windText">Wind <br> ${current.wind_kph} km/h</div>
                                        </div>
                                    </div>
                                    <div class="lower d-flex justify-content-between mt-5">
                                        <div class="feelslike text-center">
                                            <img src="./images/feelslike.png" class="climateIcon">
                                            <div class="feelsText">Feel like <br> ${current.feelslike_c} °C</div>
                                        </div>
                                        <div class="pressure-mb text-center">
                                            <img src="./images/pressure.png" class="climateIcon">
                                            <div class="pressureText">Pressure <br> ${current.pressure_mb} mbar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    `
    //! forecastdays 2 days
    for(let i = 1 ; i < forecastDays.length ; i++){
        //to convert the 2025-04-18 to 18 April 
        let date = new Date(forecastDays[i].date);
        let fullDate = convertDate(date);
        cartona +=`
                        <div class="col-sm-12 col-md-4 mb-4 mt-5 weatherCard">
                            <div class="mainCard position-relative">
                                <div class="baseCard p-3 text-center">
                                <div><h4 class="date">${fullDate}</h4></div>
                                    <img src="https:${forecastDays[i].day.condition.icon}" class="myImg mx-auto d-block" alt="sunny">
                                    <div class="temp">${forecastDays[i].day.avgtemp_c}°C</div>
                                    <div class="country">${location.name}, ${location.country}</div>
                                    <small class="status text-primary">${forecastDays[i].day.condition.text}</small>
                                </div>
                                <div class="secCard p-3">
                                    <div class="upper d-flex justify-content-between">
                                        <div class="humidity text-center">
                                            <img src="./images/humidiy.png" class="climateIcon">
                                            <div class="humText">Humidity <br> ${forecastDays[i].day.avghumidity}</div>
                                        </div>
                                        <div class="wind text-center">
                                            <img src="./images/wind.png" class="climateIcon">
                                            <div class="windText">Wind <br> ${forecastDays[i].day.maxwind_kph} kph</div>
                                        </div>
                                    </div>
                                    <div class="lower d-flex justify-content-between mt-5">
                                        <div class="feelslike text-center">
                                            <img src="./images/feelslike.png" class="climateIcon">
                                            <div class="feelsText">Feel like <br> ${forecastDays[i].hour[i].feelslike_c} °C</div>
                                        </div>
                                        <div class="pressure-mb text-center">
                                            <img src="./images/pressure.png" class="climateIcon">
                                            <div class="pressureText">Pressure <br> ${forecastDays[i].hour[i].pressure_mb} mbar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        `
    }
    document.getElementById('rowData').innerHTML = cartona;
}


function convertDate(date){
    let weekday = {
        weekday:'long'
        }
        let dayName = date.toLocaleDateString('en-US', weekday) // to make the day like Tuesday
    
        let numOfDay = date.getDate() // to get the day like 18
        let monthName = {
        month:'long'
        }
        let month = date.toLocaleDateString('en-US', monthName ) // to make the month like April
        return `${dayName}, ${numOfDay} ${month}`; // Tuseday , 18 April

}