const express = require('express');
const cors = require('cors')
const app = express();
const routes = require('./routes');
const pool = require('./database')
app.use(cors())
app.use(routes);

process.on('exit', function() {
    pool.end();
    console.log('POOL CLOSED');
});
process.on('SIGINT', function() {
    pool.end();
    console.log('POOL CLOSED');
});


app.listen(5000, ()=>{
    console.log("Server Running on port 5000")
});