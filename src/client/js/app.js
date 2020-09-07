const tripInfo = {
    formDest: '',
    city: '',
    countryName: '',
    countryCode: '',
    stateName: '',
    stateCode: '',
    lat: '',
    long: '',
    destImageUrl: '',
    weatherForecast: {},
    error: '',
}

function scrollTo(e) {
    // Only execute if an anchor element was clicked since the listener was added to the ul parent element
    if (e.target.nodeName === 'A') {
        // Prevent the default jump to the section
        e.preventDefault();
        // Select the associated section element to be scrolled to
        const tar = document.querySelector(e.target.getAttribute('href'));
        // Scroll to the element
        tar.scrollIntoView({behavior: 'smooth'});
    }
}

// document.getElementById('hero').addEventListener('click', scrollTo);

function formHandler(e) {
    e.preventDefault();

    tripInfo.formDest = document.getElementById('destination').value;
    // Initialize the user input date
    const formMonth = document.getElementById('month').value;
    const formDay = document.getElementById('day').value;
    const formYear = document.getElementById('year').value;
    const formDate = new Date(formYear, formMonth, formDay);
    // Initialize the current date w/o a timestamp
    const currDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
    // Calculate the number of days difference between the user input date and the current date (a negative number indicates a date in the past)
    const dayDiff = (formDate - currDate)/(1000 * 3600 * 24);

    console.log(`${formMonth}-${formDay}-${formYear}`);

    console.log("::: Form Submitted :::");

    if (tripInfo.formDest.length < 1) {
        console.log('No destination input received');
        alert('Please enter a city name.');
    } else if ((dayDiff < 0) || (dayDiff > 15)) {
        console.log('Travel date out of bounds');
        alert('Travel date cannot be in the past or more than 15 days in the future.')
    } else {
        fetch('http://localhost:8081/form', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripInfo)
        // body: JSON.stringify({city: tripInfo.formDest})
        })
        .then(res => res.json())
        .then(res => populateTripInfo(res))
        // .then((res) => {
        //     // console.log(res);
        //     tripInfo.city = res.city;
        //     tripInfo.countryName = res.countryName;
        //     tripInfo.countryName = res.countryCode;
        //     tripInfo.stateName = res.stateName;
        //     tripInfo.stateCode = res.stateCode;
        //     tripInfo.lat = res.lat;
        //     tripInfo.long = res.long;
        //     tripInfo.destImageUrl = res.destImageUrl;
        //     tripInfo.weatherForecast = res.weatherForecast;
        //     tripInfo.error = res.error;
        //     console.log(tripInfo);
        //     if (res.destImageUrl.length > 0) {
        //         document.getElementById('results-container').style.backgroundImage = `url(${tripInfo.destImageUrl})`;  
        //     }
        //     if (res.error.length > 0) {
        //         alert(res.error);
        //     }
        // })
        .then((res) => buildWeatherResults(dayDiff))
    }
}

function buildYearForm() {
    // Initialize the present date
    const presentDate = new Date();
    // Initialize the future date object
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate()+15);
    const presentYear = presentDate.getFullYear();
    const maxYear = maxDate.getFullYear();
    // const dd = presentDate.getDate().toString().padStart(2,'0');
    // const mm = presentDate.getMonth().toString().padStart(2,'0');

    // Dynamically build the year selection based on whether or not the maximum date for which a forecast can be returned (15 days out) is in the next year
    let option = document.createElement('option');
    let text = document.createTextNode(presentYear);
    option.appendChild(text);
    option.value = presentYear;
    document.getElementById('year').appendChild(option)

    if (presentYear !== maxYear) {
        option = document.createElement('option');
        text = document.createTextNode(maxYear);
        option.appendChild(text);
        option.value = presentYear;
        document.getElementById('year').appendChild(option)
    }
}

// Dynamically builds the day selection based on the month selected and whether or not the year selected is a leap year
function buildDayForm() {
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const daySelector = document.getElementById('day');
    let days = 31;

    while (daySelector.firstChild) {
        daySelector.removeChild(daySelector.firstChild);
    }

    if (month === '00' || month === '02' || month === '04' || month === '06' || month === '07' || month === '09' || month === '11') {
        days = 31;
    }   else if (month === '03' || month === '05' || month === '08' || month === '10') {
        days = 30;
    }   else {
        if ( ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
            days = 29;
        }   else {
            days = 28;
        }
    }

    let i;
    for (i = 1; i <= days ; i++) {
        if (i < 10) {
            i = i.toString().padStart(2, '0');
        }
        const option = document.createElement('option');
        const text = document.createTextNode(i)
        option.appendChild(text);
        option.value = i;
        daySelector.appendChild(option);
    }
}

function populateTripInfo(res) {
    tripInfo.city = res.city;
    tripInfo.countryName = res.countryName;
    tripInfo.countryName = res.countryCode;
    tripInfo.stateName = res.stateName;
    tripInfo.stateCode = res.stateCode;
    tripInfo.lat = res.lat;
    tripInfo.long = res.long;
    tripInfo.destImageUrl = res.destImageUrl;
    tripInfo.weatherForecast = res.weatherForecast;
    tripInfo.error = res.error;
    console.log(tripInfo);
    if (res.destImageUrl.length > 0) {
        document.getElementById('results-container').style.backgroundImage = `url(${tripInfo.destImageUrl})`;  
    }
    if (res.error.length > 0) {
        alert(res.error);
    }
}

// Dynamically build the weather results section based on if the users travel date is within the week or further in the future.
function buildWeatherResults(dayDiff) {
    const resultsContainer = document.getElementById('results-text-container');
    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
    }

    console.log(tripInfo.weatherForecast);
    let i;
    if (dayDiff <= 6) {
        for (i = 0; i <= 6; i++) {
            const weatherDay = document.createElement('p');
            weatherDay.innerHTML = `Date: ${tripInfo.weatherForecast[i].valid_date} High: ${tripInfo.weatherForecast[i].high_temp} Low: ${tripInfo.weatherForecast[i].low_temp} Description: ${tripInfo.weatherForecast[i].weather.description}`;
            // const text = document.createTextNode('Days Forecast');
            // weatherDay.appendChild(text);
            resultsContainer.appendChild(weatherDay);
        }
    }   else {
        for (i = 7; i <= 15; i++) {
            const weatherDay = document.createElement('p');
            weatherDay.innerHTML = `Date: ${tripInfo.weatherForecast[i].valid_date} High: ${tripInfo.weatherForecast[i].high_temp} Low: ${tripInfo.weatherForecast[i].low_temp} Description: ${tripInfo.weatherForecast[i].weather.description}`;
            // const text = document.createTextNode('Days Forecast');
            // weatherDay.appendChild(text);
            resultsContainer.appendChild(weatherDay);
        }
    }
}

export {
    scrollTo,
    formHandler,
    buildYearForm,
    buildDayForm,
    buildWeatherResults,
}