const express = require('express');
const cors = require('cors')
const app = express();
const routes = require('./routes');
const pool = require('./database')
app.use(cors())
// https://www.youtube.com/watch?v=SccSCuHhOw0&ab_channel=WebDevSimplified
// https://github.com/gothinkster/node-express-realworld-example-app
// https://stackoverflow.com/questions/51535455/express-js-use-async-function-on-requests#:~:text=async%20function%20always%20returns%20a,entirely%20handled%20in%20async%20function.
// https://node-postgres.com/features/connecting

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