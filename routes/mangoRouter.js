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
            console.log('Parametro: id --> ' + req.query['id']);
            console.log('JSON: '+req.body.P1);
            //db.getCustomer(req, res, next;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                var respuesta = {
                    texto: 'Test OK',
                    id: req.query['id'],
                    request: req.body
                };
                res.json(respuesta);


            });
/*
Simulación
**********
    Request:
            {
                clientid: "123",
                email: "abc@abc.com",
                loyaltyEan:"123",
                ticket: {
                    storeid: "xxx"
                    ticketid: "123",
                    productid: "123",
                    ticketTimestamp: "01/01/2018 09:00:00",
                    ticketAmount: 23
                }
            }

    Lógica: 
        Vamos a buscar al cliente a la tabla de clientes, el producto a la de productos y buscamos que regla aplica para calcular los LIKES

    Respuesta:
            {
                status: "OK",
                message: "OK",
                ticketid: "123",
                purchasePoints: 12,
                purchaseTimeStamp: "012/012/2018 09:00:00",
                clientPoints: 1200
            }

    No se modifica ninguna tabla
*/
mangoRouter.route('/simulacion')
    .post((req, res, next) => {
        console.log('Emepezando Simulación...');
        console.log('JSON Request: ' + req.body);
        db.getSimulation(req, res, next);
    });

module.exports = mangoRouter;