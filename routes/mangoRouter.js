const express = require('express');
var unirest = require('unirest');


var db = require('../queries');

const mangoRouter = express.Router();

mangoRouter.route('/compra/:id')
.post((req, res, next) => {
            console.log('Test OK');
            db.getCustomer(req, res, next);
            /*res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            var respuesta = { texto: 'Test OK' };
            res.json(respuesta);*/
       
    
});

mangoRouter.route('/compra')
    .post((req, res, next) => {
            console.log('Test OK2');
            console.log('Parametro: id --> ' + req.param('id'));
            console.log('JSON: '+req.body);
            //db.getCustomer(req, res, next;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                var respuesta = {
                    texto: 'Test OK',
                    id: req.param('id'),
                    request: req.body
                };
                res.json(respuesta);


            });

module.exports = mangoRouter;