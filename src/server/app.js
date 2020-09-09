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

// Dependencies
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

// Define API Credentials
const geoUsername = process.env.GEO_USER;
const weatherBitKey = process.env.WB_KEY;
const pixabayKey = process.env.PIX_KEY;

const app = express();
// Configure express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Configure express to use cors for cross origin allowance
app.use(cors());

// Initializing the main project folder
app.use(express.static('dist'));

app.post('/form', (req, res) => {
    resetTrip();
    tripInfo.formDest = req.body.formDest;
    getLocDetails(tripInfo.formDest, (data) => {
        res.send(data)
    })
})

// This function contains a set of 3 get requests that carry out asynchronously to the Geonames, Weatherbit, & Pixabay APIs
const getLocDetails = (city, callback) => {
    axios.get(`http://api.geonames.org/searchJSON?q=${city}&maxRows=10&username=${geoUsername}`)
    .then(res => {
        if ((res.status === 200) && (res.data.geonames.length ===0)) {
            console.log('Successful get request, however no locations were found matching the input destination');
            tripInfo.error = 'No matching location data was found in the Geonames database.  Please check your input for errors or search a new location';
            callback(tripInfo);
        }   else {
            const geonames = res.data.geonames[0];
            tripInfo.lat = geonames.lat;
            tripInfo.long = geonames.lng;
            tripInfo.countryName = geonames.countryName;
            tripInfo.countryCode = geonames.countryCode;
            tripInfo.stateCode = geonames.adminCode1;
            tripInfo.stateName = geonames.adminName1;
            axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?lat=${geonames.lat}&lon=${geonames.lng}&key=${weatherBitKey}`)
            .then(res => {
                tripInfo.city = res.data.city_name;
                tripInfo.weatherForecast = res.data.data;
                let secQueryParam = '';
                if (tripInfo.countryCode === 'US') {
                secQueryParam = tripInfo.stateName;
                }   else {
                    secQueryParam = tripInfo.countryName;
                }
                axios.get(`https://pixabay.com/api/?key=${pixabayKey}&q=${tripInfo.city}+${secQueryParam}&image_type=photo&category=places&safesearch=true`)
                .then(res => {
                    if ((res.status === 200) && (res.data.hits.length === 0)) {
                        console.log('Successful get request, however no images were found matching the input destination');
                        tripInfo.error = 'No images were found matching the input destination';
                        callback(tripInfo);
                    }   else {
                        tripInfo.destImageUrl = res.data.hits[0].largeImageURL;
                        callback(tripInfo);
                    }
                })
                .catch(error => {
                    console.log(error, 'Pixabay get request error')
                    callback({error: 'Pixaby get request error'});
                })
            })
            .catch (error => {
                console.log(error, 'Weatherbit get request error');
                callback({error: 'Weatherbit get request error'});
            })
        }
    })
    .catch (error => {
        console.error(error, 'Geonames get request error');
        callback({error: 'Geonames get request error'});
    })
}

// This function resets the tripInfo object property values.  This is necessary so that old data is not returned to the client in the event of a failed GET request to one of the three APIs
const resetTrip = () => {
    tripInfo.formDest = '';
    tripInfo.city = '';
    tripInfo.countryName = '';
    tripInfo.countryCode = '';
    tripInfo.stateName = '';
    tripInfo.stateCode = '';
    tripInfo.lat = '';
    tripInfo.long = '';
    tripInfo.destImageUrl = '';
    tripInfo.weatherForecast = {},
    tripInfo.error = '';
}

module.exports = {app, resetTrip};
// export { resetTrip };