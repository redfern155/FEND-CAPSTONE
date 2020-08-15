// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// Configure express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Configure express to use cors for cross origin allowance
app.use(cors());

// Initializing the main project folder
app.use(express.static('dist'));

// Shouldn't need this get request, can most likely delete.
// app.get('/', (req, res) => {
//     res.sendFile('dist/index.html')
// });

const port = 8081;
const server = app.listen(port, () => {
    console.log(`Running on localhost: ${port}`)
});
