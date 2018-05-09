const express = require('express');
var unirest = require('unirest');


var db = require('../queries');

const mangoRouter = express.Router();

mangoRouter.route('/compra/:id')
.post((req, res, next) => {
            console.log('Test OK');
            db.getCustomer;
            /*res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            var respuesta = { texto: 'Test OK' };
            res.json(respuesta);*/
       
    
});

module.exports = mangoRouter;