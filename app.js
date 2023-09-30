const wrapper = document.querySelector('.box');
inputPart = wrapper.querySelector(".input");
infotxt = inputPart.querySelector(".info-txt");
inputfield = inputPart.querySelector("input");
let apikey = "5dfefffd59471996d265deee7c7543ed";
weather = wrapper.querySelector('.weather-part');
locationbtn = inputPart.querySelector("button");
wimg=weather.querySelector('img');
arrowremover=wrapper.querySelector('i');

inputfield.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputfield.vlaue != "") {
        const val = inputfield.value;
        requestApi(val);
    }
})
locationbtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else {
        alert("geolocation api not supported");
    }
})
function onError(error) {
    // console.log(error);
    infotxt.innerText = `${error.message}`;
    infotxt.classList.add("error")
}
function onSuccess(position) {
    // console.log(position);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    console.log(lat);
    console.log(lon);

    infotxt.innerText = "getting weather details....";
    infotxt.classList.add("pending")

    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`)
        .then(res => {
            getinfo(res.data);
        })
        .catch(err => {
            console.log("ERROR", err);
            geterror(err);
        })
}
function requestApi(city) {
    infotxt.innerText = "Getting weather details....";
    infotxt.classList.add("pending")

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`)
        .then(res => {
            getinfo(res.data);
        })
        .catch(err => {
            console.log("ERROR", err);
            geterror(err);
        })

}
function geterror(info) {
    if (info.response.data.cod == "404") {
        infotxt.innerText = `${inputfield.value} isn't a valid city`;
        infotxt.classList.remove("pending")
        infotxt.classList.add("error","glow");
    }
    
}
function getinfo(info) {
    infotxt.classList.remove("pending", "error","glow");
    wrapper.classList.add("active");
    let wid=info.weather[0].id;
    if(wid==800)
    {
        wimg.src="image/clear.png";
    }
    else if(wid>=801)
    {
        wimg.src="image/clouds.png";
    }
    else if(wid>=301 && wid<400)
    {
        wimg.src="image/drizzle.png";
    }
    else if(wid==701)
    {
        wimg.src="image/mist.png";
    }
    else if(wid>=501 && wid<600)
    {
        wimg.src="image/rain.png";
    }
    else if(wid>=601 && wid<700)
    {
        wimg.src="image/snow.png";
    }
    else if(wid>=201 && wid<300)
    {
        wimg.src="image/thunder.jpg";
    }
    
    console.log(info);
    let country=info.sys.country;
    if(country=="IN")country="India";
    weather.querySelector('.name').innerText = `${info.name} , ${country}`;
    weather.querySelector('.des').innerText = info.weather[0].main ;
    weather.querySelector('.numb').innerText = Math.floor(info.main.temp);
    weather.querySelector('#feelslike').innerText = Math.floor(info.main.feels_like);
    weather.querySelector('#humid').innerText = info.main.humidity;

}
arrowremover.addEventListener('click',()=>
{
    wrapper.classList.remove("active");
    infotxt.innerText = "Enter a valid city name";
    infotxt.classList.remove("pending", "error","glow");
})