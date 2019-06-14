const express = require('express');
// const unirest = require('unirest');


const db = require('../queries');

const cepsaRouter = express.Router();

cepsaRouter.route('/compra/:id')
    .post((req, res, next) => {
        console.log('Test OK');
        db.getCustomer(req, res, next);
        /* res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        var respuesta = { texto: 'Test OK' };
        res.json(respuesta); */


    });

/*
Simulación
**********
    Request:
            {
                "clientid": "Paccount.003",
                "email": "abc@abc.com",
                "loyaltyEan": "123",
                "ticket": {
                    "storeid": "ILLA",
                    "ticketid": "123",
                    "productid": "23053036",
                    "ticketTimestamp": "01/01/2018 09:00:00",
                    "ticketAmount": 23
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
cepsaRouter.route('/simulacion')
    .post((req, res, next) => {
        console.log('Emepezando Simulación...');
        console.log(`JSON Request: ${  JSON.stringify(req.body, null, 2)}`);
        db.getSimulation(req, res, next);
    });

cepsaRouter.route('/test-xml')
    .post((req, res, next) => {
        console.log('Emepezando Test XML...');
        console.log(`JSON Request: ${  JSON.stringify(req.body, null, 2)}`);
        res.setHeader('Content-Type', 'application/json');
        res.json(req.body);
    });

cepsaRouter.route('/compra')
    .post((req, res, next) => {
        console.log('Emepezando Compra...');
        console.log(`JSON Request: ${  JSON.stringify(req.body, null, 2)}`);
        db.newCompra(req, res, next);
    });

cepsaRouter.route('/redeem')
    .post((req, res, next) => {
        console.log('Emepezando Redención...');
        console.log(`JSON Request: ${  JSON.stringify(req.body, null, 2)}`);
        db.redeem(req, res, next);
    });
module.exports = cepsaRouter;