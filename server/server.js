const express = require('express');
const cors = require('cors')
const app = express();
const routes = require('./routes');
app.use(cors())

// https://www.youtube.com/watch?v=SccSCuHhOw0&ab_channel=WebDevSimplified
// https://github.com/gothinkster/node-express-realworld-example-app
// https://stackoverflow.com/questions/51535455/express-js-use-async-function-on-requests#:~:text=async%20function%20always%20returns%20a,entirely%20handled%20in%20async%20function.
// https://node-postgres.com/features/connecting

app.use(routes);
app.listen(5000, ()=>{
    console.log("Server Running on port 5000")
});