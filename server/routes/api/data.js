const express = require('express');
const router = express.Router();
const pool = require('../../database');
const _ = require('lodash');

router
.get('/initial-view', async (req, res, next)=>{

    const client = await pool.connect();
    try{
        const tableInfo = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='open_covid'");
        const columns = tableInfo.rows.reduce((prev, cur)=>{
            prev[cur.column_name] = cur.data_type;
            return prev
        }, {})
        const countryQuery = {
            text: "SELECT DISTINCT country_name FROM open_covid",
            rowMode: 'array'
        };
        const countries = await client.query(countryQuery);
        res.send({
            tableInfo: columns,
            countries: countries.rows.flat()
        })        
    }
    catch (error){
        next(error)
    }
    finally{
        client.release()
        console.log("CLIENT RELEASED")  
    }
});

router
.get('/get-data', async (req, res, next) => {
    const indepVar = req.query.indepVar;
    const depVar = req.query.depVar;
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
            }, "SELECT ").concat(" FROM open_covid WHERE country_name='Canada' ORDER BY date ASC");
            client.query(text)  // query the database
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
                console.log(indepData);
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

///// GRAVEYARD
// router
// .get('/data-columns', async(req, res, next) => {
//     pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='open_covid'")
//     .then((response)=> {
//         res.send({dbInfo: response.rows});
//     })
//     .catch((err) => {
//         res.status(500).send({message: 'Database connection error'})
//         next(err);
//     })
// });

// router
// .get('/countries', async(req, res, next) =>{
//     const query = {
//         text: "SELECT DISTINCT country_name FROM open_covid",
//         rowMode: 'array'
//     }
//     pool.query(query)
//     .then((response)=>{
//         res.send({
//             countries: response.rows.flat()
//         })
//     })
//     .catch(err=>{
//         next(err)
//     })
// });