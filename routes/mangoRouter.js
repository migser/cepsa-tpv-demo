const express = require('express');
var unirest = require('unirest');
//var token = '';
//var mensaje = require('../mensaje')('https://miguel-iot.my.salesforce.com/services/data/v41.0/sobjects/');
//var auth = require('../auth')('admin@miguel.iot', 'sfdc1234HJtedhTlK779SHBORSLHynRw', '3MVG9g9rbsTkKnAWdtjzTDiZAFT4z.PuJSnwGz9z0uACd_zN11ucyRmF9f.0fAx2qkJNu.MpIV4b4IIMqp1eS',
//    '8769286430156645141',
//    (response) => {
//        console.log('Conectado Demo Miguel!');
//        token = response.body.access_token;
//    }
//);
//var evento = 'Tracker_Event__e';

var db = require('../queries');

const eventRouter = express.Router();

//auth.auth();

eventRouter.route('/compra')
.post((req, res, next) => {
            console.log('Test OK');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            var respuesta = { texto: 'Test OK' };
            res.json(respuesta);
       
    
});

module.exports = eventRouter;