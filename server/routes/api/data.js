const express = require('express');
const router = express.Router();
const pool = require('../../database');

router
.get('/data-columns', async(req, res, next) => {
    pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='open_covid'")
    .then((response)=> {
        res.send({dbInfo: response.rows});
    })
    .catch((err) => {
        res.status(500).send({message: 'Database connection error'})
        next(err);
    })
    .then(async()=>{
        await pool.end();
        console.log("POOL CLOSED")
    })
});

router
.get('/get-data', async (req, res, next) => {
    const indepVar = req.query.indepVar;
    const depVar = req.query.depVar;
    const columns = indepVar.concat(depVar);

    pool.connect()
    .then((client)=>{
        return client
        .query({
            text:"SELECT column_name FROM information_schema.columns WHERE table_name='open_covid'",
            rowMode:'array'
        })
        .then(response=>{
            const fieldNames = response.rows.flat() //  Get the column names of table
            const safeColumns = columns.filter(column=>fieldNames.includes(column))  // ensure the columns are in the table
            const text = safeColumns.reduce((pre, cur, index)=>{
                return index > 0 ? pre + `, ${cur}` : pre + `${cur} `
            }, "SELECT ").concat(" FROM open_covid ORDER BY date ASC");
            client.query(text)  // query the database
            .then(response=>{
                res.send({dumbData: response.rows})
            })
            .catch(err=>{
                next(err)
            });
        })
        .catch(err=>{
            next(err)
        })
        .then(()=>{
            client.release();
            console.log("Client Released")
        })
    })






    // // const text = columns.reduce((pre, cur, index)=>{
    // //     return index > 0 ? pre + `, $${index+1}` : pre + `$${index+1} `
    // // }, "SELECT ");
    // // need to be careful about SQL injection here -- however all data in the database should be accessible to the user
    // const text = columns.reduce((pre, cur, index)=>{
    //     return index > 0 ? pre + `, ${cur}` : pre + `${cur} `
    // }, "SELECT ");


    // const query = {
    //     text: text.concat(" FROM open_covid ORDER BY date ASC"),
    //     // values: ['date']//columns
    // };


    // pool.query(query)
    // .then((response)=> {
    //     res.send({
    //         dumbData: response.rows
    //     })
    //     console.log(response);
    // })
    // .catch((err) => {
    //     res.status(500).send({message: 'Database connection error'})
    //     next(err);
    // })
    // .then(async()=>{
    //     await pool.end();
    //     console.log("POOL CLOSED")
    // })


});

module.exports = router;