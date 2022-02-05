const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors())
// https://www.youtube.com/watch?v=SccSCuHhOw0&ab_channel=WebDevSimplified
// https://github.com/gothinkster/node-express-realworld-example-app
// https://console.cloud.google.com/bigquery?p=bigquery-public-data&d=covid19_open_data&page=dataset&project=triple-grove-306118
// https://cloud.google.com/bigquery/docs/samples/bigquery-add-column-load-append#bigquery_add_column_load_append-nodejs
// https://stackoverflow.com/questions/55115341/how-to-pass-query-statement-to-bigquery-in-node-js-environment

//https://console.cloud.google.com/bigquery?p=bigquery-public-data&d=covid19_open_data&page=table&project=triple-grove-306118&t=covid19_open_data&ws=!1m10!1m4!4m3!1sbigquery-public-data!2scovid19_open_data!3scompatibility_view!1m4!4m3!1sbigquery-public-data!2scovid19_open_data!3scovid19_open_data

app.get("/api", (req, res, next)=>{
    console.log('Im touched')
    res.json({users: ['1', '2', '4']})
});

app.listen(5000, ()=>{
    console.log("Server Running on port 5000")
});