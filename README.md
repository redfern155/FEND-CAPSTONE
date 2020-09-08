# FEND Capstone - Travel App

## Description

This is the Capstone project for the Udacity Front End Web Developer course.  The overall goal of this project was to put into practice the skills learned over throughout the Front End Web Developer course including:

- HTML & CSS
- Javascript & The DOM
- Web APIs and Asynchronous Javascript
- Build Tools (webpack) & Single Page Web Apps

## Project Function

The overall function of the project is to provide a webpage where a user can input a destination and a travel date, and be returned a photo and weather forecast of the destination.

Upon form sumbmission the following steps occur:

1. The form fields are validated to ensure a destination was input and that the date is within range (see Limitations).
2. A POST request is made to the server passing along the user input destination.
3. The server then makes a GET request to the [Geonames API](https://www.geonames.org/export/geonames-search.html) for location information matching the input destination.
4. If a matching location is found, the lat & long obtained from Geonames are then used to make a GET request to the [Weatherbit Forecast API (16 day / daily)](https://www.weatherbit.io/api/weather-forecast-16-day) to obtain a 16 day forecast for the location.
5. Using the City Name and State Code/Country Name values received from the previous API calls, a GET request is then made to the [Pixabay API](https://pixabay.com/api/docs/) to obtain a photo of the destination.

## Limitations

Weatherbit only returns a forecast for the current day up to 15 days in the future (16 days total).  Therefore the user date input is limited to the current date up to 15 days in the future.  

## Installation

[Node.js](https://nodejs.org/en/) is required to run this project.

Once Node.js is installed, [npm](https://www.npmjs.com/) can be used to install the dependencies.

```bash
npm i
```
Run the following command to build the distribution file folder and content with webpack.

```bash
npm run build-prod
```