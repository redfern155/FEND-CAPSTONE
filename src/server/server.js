const app = require('./app').app;

const port = 8081;
const server = app.listen(port, serverInit);

function serverInit() {
    console.log(`Running on localhost ${port}`)
}