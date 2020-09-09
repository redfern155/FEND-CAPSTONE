// Initialize an object and properties to store the trip info
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

// This function only executes on anchor elements, and smoothly scrolls to the anchor's href once the anchor is clicked
const scrollTo = (e) => {
    if (e.target.nodeName === 'A') {
        e.preventDefault();
        const tar = document.querySelector(e.target.getAttribute('href'));
        tar.scrollIntoView({behavior: 'smooth'});
    }
}

// This function validates user input, submits a POST request, and then calls the populateTripInfo and buildWeatherResults functions
const formHandler = (e) => {
    e.preventDefault();
    // Retrieve the form inputs
    tripInfo.formDest = document.getElementById('destination').value;
    const formMonth = document.getElementById('month').value;
    const formDay = document.getElementById('day').value;
    const formYear = document.getElementById('year').value;
    const dayDiff = calcDateDifference(formYear, formMonth, formDay);

    console.log("::: Form Submitted :::");

    // Initialize the POST request if the user input a location and the user input date is not in the past nor more than 15 days in the future
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
        })
        .then(res => res.json())
        .then(res => populateTripInfo(res))
        .then(res => buildWeatherResults(dayDiff))
    }
}

// This function dynamically sets the year options that the user has to choose from based on the current date
const buildYearForm = () => {
    // Initialize the present date
    const presentDate = new Date();
    // Initialize the future date object
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate()+15);
    const presentYear = presentDate.getFullYear();
    const maxYear = maxDate.getFullYear();

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

// This function dynamically builds the day selection based on the month selected and whether or not the year selected is a leap year
const buildDayForm = () => {
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

const calcDateDifference = (year, month, day) => {
    // Initialize the user input date object w/o a timestamp
    const formDate = new Date(year, month, day);
    // Initialize the current date object w/o a timestamp
    const currDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
    // Calculate the number of days difference between the user input date and the current date (a negative number indicates a date in the past)
    const dayDiff = (formDate - currDate)/(1000 * 3600 * 24);
    return dayDiff;
}

// This function populates the trip info ojbect with the returned data from the POST request.
const populateTripInfo = (res) => {
    tripInfo.city = res.city;
    tripInfo.countryName = res.countryName;
    tripInfo.countryCode = res.countryCode;
    tripInfo.stateName = res.stateName;
    tripInfo.stateCode = res.stateCode;
    tripInfo.lat = res.lat;
    tripInfo.long = res.long;
    tripInfo.destImageUrl = res.destImageUrl;
    tripInfo.weatherForecast = res.weatherForecast;
    tripInfo.error = res.error;
    console.log(tripInfo);
    if (res.destImageUrl.length > 0) {
        document.getElementById('destination-image').style.backgroundImage = `url(${tripInfo.destImageUrl})`;  
    }
    if (res.error.length > 0) {
        alert(res.error);
        document.getElementById('destination-image').style.backgroundImage = `url('')`
    }
}

// This function dynamically builds the weather results section based on if the users travel date is within the week or further in the future.
const buildWeatherResults = (dayDiff) => {
    const resultsContainer = document.getElementById('results-text-container');
    const resultsHeader = document.getElementById('results-header');
    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
    }

    let secondaryLoc = '';
    if (tripInfo.countryCode === 'US') {
        secondaryLoc = tripInfo.stateCode;
    }   else {
        secondaryLoc = tripInfo.countryName;
    }

    if (tripInfo.weatherForecast.length >0) {
        let i;
        if (dayDiff <= 6) {
            for (i = 0; i <= 6; i++) {
                const weatherDay = document.createElement('li');
                weatherDay.innerHTML = `<strong>Date:</strong> ${tripInfo.weatherForecast[i].valid_date} <strong>High:</strong> ${tripInfo.weatherForecast[i].high_temp}&#176;C <strong>Low:</strong> ${tripInfo.weatherForecast[i].low_temp}&#176;C <strong>Description:</strong> ${tripInfo.weatherForecast[i].weather.description}`;
                resultsContainer.appendChild(weatherDay);
                resultsHeader.innerHTML = `${tripInfo.city}, ${secondaryLoc}: Current Week's Forecast`;
            }
        }   else {
            for (i = 7; i <= 15; i++) {
                const weatherDay = document.createElement('li');
                weatherDay.innerHTML = `<strong>Date:</strong> ${tripInfo.weatherForecast[i].valid_date} <strong>High:</strong> ${tripInfo.weatherForecast[i].high_temp}&#176;C <strong>Low:</strong> ${tripInfo.weatherForecast[i].low_temp}&#176;C <strong>Description:</strong> ${tripInfo.weatherForecast[i].weather.description}`;
                resultsContainer.appendChild(weatherDay);
                resultsHeader.innerHTML = `${tripInfo.city}, ${secondaryLoc}: Future Forecast (Beyond Current Week)`;
            }
        }
    }   else {
        resultsHeader.innerHTML = 'No Returned Weather Data';
    }
}

// Wrap event listeners in a function to export to index.js
const initEventListeners = () => {
    document.getElementById('hero').addEventListener('click', scrollTo);
    document.getElementById('formSubmit').addEventListener('click', formHandler);
    document.addEventListener('DOMContentLoaded', buildYearForm)
    document.getElementById('month').addEventListener('change', buildDayForm);
}

export {
    buildYearForm,
    buildWeatherResults,
    initEventListeners,
    calcDateDifference
}