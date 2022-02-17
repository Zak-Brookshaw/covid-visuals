const express = require('express');
const router = express.Router();
const pool = require('../../database');
const _ = require('lodash');
const axios = require('axios');


router
.get('/fit-data', async (req, res, next)=>{
    const client = await pool.connect();
    try{
        const x = req.query.indepVar; // must be a list
        const y = req.query.depVar;  // must be a single string
        const apiResponse = await axios.post(`${process.env.FLASK_API_URL}/anova/fit-model`,
            {
                x, 
                y
            });

        res.send({
            ...apiResponse.data
        });        
    }
    finally{
        client.release();
        console.log("Client Released")
    }

});

module.exports = router;
