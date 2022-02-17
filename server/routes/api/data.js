const express = require('express');
const router = express.Router();
const pool = require('../../database');
const _ = require('lodash');

router
.get('/initial-view', async (req, res, next)=>{

    const client = await pool.connect();
    try{
        const tableInfo = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='open_covid' AND column_name NOT LIKE '%search%' ORDER BY column_name ASC");
        const locationQuery = {
            text: "SELECT DISTINCT location_key FROM open_covid ORDER BY location_key",
            rowMode: 'array'
        };
        const locations = await client.query(locationQuery);
        const locs = locations.rows.reduce((prev, cur) => {
            const list = cur[0].split('_');
            const country = list[0];
            const region = list.length > 1 ? list[1] : null;
            // prev[country] = prev[country] !== undefined ? [...prev[country], region] : prev[country] = [region];
            if (prev[country] !== undefined){
                prev[country] = prev[country].includes(region) ? prev[country] : [...prev[country], region];
            }
            else {
                prev[country] = [region]
            }
            return prev
        }, {})
        console.log(locs)
        res.send({
            tableInfo: tableInfo.rows,
            locations: locs,
        })        
    }
    catch (error){
        next(error)
    }
    finally{
        client.release()
        console.log("Client Released")  
    }
});

router
.get('/get-data', async (req, res, next) => {
    const indepVar = req.query.indepVar;
    const depVar = req.query.depVar;

    const location_key = req.query.location_key;
    console.log(depVar);
    const columns = indepVar.concat(depVar);
    pool.connect()
    .then( async (client)=>{
        client
        .query({
            text:"SELECT column_name FROM information_schema.columns WHERE table_name='open_covid'",
            rowMode:'array'
        })
        .then(response=>{
            const fieldNames = response.rows.flat() //  Get the column names of table
            const safeColumns = columns.filter(column=>fieldNames.includes(column))  // ensure the columns are in the table
            const text = safeColumns.reduce((pre, cur, index)=>{
                return index > 0 ? pre + `, ${cur}` : pre + `${cur} `
            }, "SELECT ").concat(" FROM open_covid WHERE location_key=$1 ORDER BY date ASC");
            client.query({text, values:[location_key]})  // query the database
            .then(response=>{
                // create an array structure: x:[value1, value2, ...]
                const indepData = indepVar.reduce((prev, cur, index)=>{
                    prev[cur] = response.rows.map((row)=>row[cur]);
                    return prev
                }, {});
                const depData = depVar.reduce((prev, cur, index)=>{
                    prev[cur] = response.rows.map((row)=>row[cur]);
                    return prev
                }, {});
                res.send({
                    indepData,
                    depData
                });
            })
            .catch(err=>{
                next(err)
            });
        })
        .catch(err=>{
            next(err)
        })
        .then( async ()=>{
            client.release();
            console.log("Client Released")
        })
    })
    .catch(err=>{
        next(err)
    })
});

module.exports = router;
