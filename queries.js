const promise = require('bluebird');
const time = require('time');

const options = {
    // Initialization Options
    promiseLib: promise
};

const pgp = require('pg-promise')(options);

const connectionString = process.env.DATABASE_URL;
pgp.pg.defaults.ssl = true;
const db = pgp(connectionString);
console.log('Conectado a la BBDD');
// add query functions

function getCustomer(req, res, next) {
    console.log('Iniciando getCustomer');
    const customer = parseInt(req.params.id, 10);
    db.one('select * from test where B = $1', customer)
        .then((data) => {
            res.status(200)
                .json({
                    status: 'success',
                    data,
                    message: 'Retrieved ONE Customer'
                });
        })
        .catch((err) => {
            return next(err);
        });
}

function getSimulation(req, res, next) {
    console.log('Iniciando getSimulation');
    const {
        clientId
    } = req.body;
    const productId = req.body.ticket;
    const storeId = req.body.ticket;
    const amount = req.body.ticket.ticketAmount;
    console.log(`Parametros: ${  clientId  } ${  productId  } ${  storeId  } ${  amount}`);
    const likes = `likes('${  clientId  }','${  storeId  }','${  productId  }',${  amount  })`;
    console.log(`funcion: ${  likes}`);
    db.one('SELECT * FROM $1:raw', likes)
        // db.one('select * from likes($1,$2,$3,$4)',[clientId,storeId,productId,amount])
        .then((data) => {
            console.log(`Aplicando regla ${  data.rule  } Timestamp: ${  Date.now().toString()}`);
            const d = new time.Date();
            d.setTimezone('Europe/Madrid');
            res.status(200)
                .json({
                    status: 'OK',
                    message: `Aplicada regla: ${  data.rule}`,
                    ticketid: req.body.ticket.ticketId,
                    purchasePoints: data.likes,
                    purchaseTimeStamp: d.toString(),
                    clientPoints: data.total_likes
                });
        })
        .catch((err) => {
            res.status(500)
                .json({
                    status: 'Error',
                    message: err,
                    ticketid: req.body.ticket.ticketId,
                    purchasePoints: null,
                    purchaseTimeStamp: null,
                    clientPoints: null,
                });
            return next(err);
        });
}

function newCompra(req, res, next) {
    console.log('Iniciando newCompra');
    const clientId = req.body;
    const email = req.body;
    const storeId = req.body.ticket;
    const loyaltyEan = req.body;
    const ticketAmount = req.body.ticket;
    const ticketTimestamp = req.body.ticket;
    const ticketId = req.body.ticket;
    const lineas = req.body.ticket;
    const clientPoints = req.body;
    const likesRedeemed = req.body;
    const newTicket = `new_ticket('${  clientId  }','${  storeId  }','${  email  }','${  loyaltyEan  }',${ 
        ticketAmount  },'${  ticketTimestamp  }','${  ticketId  }',${  lineas  })`;
    console.log(`funcion: ${  newTicket}`);
    // Comprobamos que se van a redimir menos likes de los que tiene
    if (likesRedeemed > clientPoints) {
        const d = new time.Date();
        console.log(`Error: no se pueden redimir más puntos de los disponibles: ${  likesRedeemed  } ${  clientPoints}`);

        d.setTimezone('Europe/Madrid');
        res.status(400)
            .json({
                status: 'Error',
                message: `No se pueden redimir más likes de los disponibles. Likes disponibles: ${  clientPoints  } > Likes a redimir: ${  likesRedeemed}`,
                ticketid: ticketId,
                purchasePoints: null,
                purchaseTimeStamp: d.toString(),
                clientPoints: null
            });
    } else // el precio total tiene que ser al menos el 50% del original
        if (likesRedeemed * 0.05 > ticketAmount * 0.5) {
            console.log('Error: no se puede descontar más del 50% del importe original.');
            const d = new time.Date();
            d.setTimezone('Europe/Madrid');
            res.status(400)
                .json({
                    status: 'Error',
                    message: `No se puede descontar más del 50% del importe original. Importe Original: ${  ticketAmount  } €, descuento a aplicar : ${  likesRedeemed * 0.05  } €`,
                    ticketid: ticketId,
                    purchasePoints: null,
                    purchaseTimeStamp: d.toString(),
                    clientPoints: null
                });
        }
    else
        db.one('select * from new_ticket($1,$2,$3,$4,$5,$6,$7,$8::json,$9)', [clientId, storeId, email, loyaltyEan, ticketAmount, ticketTimestamp, ticketId, lineas, likesRedeemed])
        .then(data => {
            console.log(`Guardando ticket: ${  ticketId}`);
            console.log(`DAtos: ${  data.length}`);
            const d = new time.Date();
            d.setTimezone('Europe/Madrid');
            res.status(200)
                .json({
                    status: 'OK',
                    message: `Ticket Guardado: ${  ticketId}`,
                    ticketid: ticketId,
                    purchasePoints: data.total_amount,
                    purchaseTimeStamp: d.toString(),
                    clientPoints: data.clientpoints,
                });
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            res.status(500)
                .json({
                    status: 'Error',
                    message: error,
                    ticketid: ticketId,
                    purchasePoints: null,
                    purchaseTimeStamp: null,
                    clientPoints: null,
                });
            return next(error);
        });
}

function redeem(req, res, next) {
    const {
        clientPoints
    } = req.body;
    const {
        ticketId
    } = req.body;
    const {
        likesRedeemed
    } = req.body;
    const {
        ticketAmount
    } = req.body;
    const {
        clientId
    } = req.body;

    db.one('select * from likes_validos($1)', [clientId])
        .then(data => {
            if (data.valido === 'OK') {
                if (likesRedeemed > clientPoints) {
                    console.log('Error: no se pueden redimir más puntos de los disponibles.');
                    const d = new time.Date();
                    d.setTimezone('Europe/Madrid');
                    res.status(400)
                        .json({
                            status: 'Error',
                            message: `No se pueden redimir más likes de los disponibles. Likes disponibles: ${  clientPoints  } > Likes a redimir: ${  likesRedeemed}`,
                            ticketid: ticketId,
                            likesRedeemed,
                            purchaseTimeStamp: d.toString(),
                            likesExpirationDate: data.expiration,
                            newClientPoints: clientPoints,
                            originalCLientPoints: clientPoints,
                            newAmount: ticketAmount,
                            originalAmount: ticketAmount
                        });
                } else // el precio total tiene que ser al menos el 50% del original
                    if (likesRedeemed * 0.05 > ticketAmount * 0.5) {
                        console.log('Error: no se puede descontar más del 50% del importe original.');
                        const d = new time.Date();
                        d.setTimezone('Europe/Madrid');
                        res.status(400)
                            .json({
                                status: 'Error',
                                message: `No se puede descontar más del 50% del importe original. Importe Original: ${  ticketAmount  } €, descuento a aplicar : ${  likesRedeemed * 0.05  } €`,
                                ticketid: ticketId,
                                likesRedeemed,
                                purchaseTimeStamp: d.toString(),
                                likesExpirationDate: data.expiration,
                                newClientPoints: clientPoints,
                                originalCLientPoints: clientPoints,
                                newAmount: ticketAmount,
                                originalAmount: ticketAmount
                            });
                    }
                else {
                    console.log(`Redención: ${  ticketId}`);
                    const d = new time.Date();
                    d.setTimezone('Europe/Madrid');
                    res.status(200)
                        .json({
                            status: 'OK',
                            message: `Redencion correcta: ${  ticketId}`,
                            ticketid: ticketId,
                            likesRedeemed,
                            purchaseTimeStamp: d.toString(),
                            likesExpirationDate: data.expiration,
                            newClientPoints: clientPoints - likesRedeemed,
                            originalCLientPoints: clientPoints,
                            newAmount: ticketAmount - (likesRedeemed * 0.05),
                            originalAmount: ticketAmount
                        });
                }
            } else {
                console.log('Error: los likes han caducado.');
                const d = new time.Date();
                d.setTimezone('Europe/Madrid');
                const d2 = new time.Date(data.expiration);
                d.setTimezone('Europe/Madrid');
                res.status(400)
                    .json({
                        status: 'Error',
                        message: `Los likes han caducado y no se pueden redimir. Fecha de caducidad: ${  data.expiration}`,
                        ticketid: ticketId,
                        likesRedeemed,
                        purchaseTimeStamp: d.toString(),
                        likesExpirationDate: d2.toString(),
                        newClientPoints: clientPoints,
                        originalCLientPoints: clientPoints,
                        newAmount: ticketAmount,
                        originalAmount: ticketAmount
                    });
            }
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
            res.status(500)
                .json({
                    status: 'Error',
                    message: error,
                    ticketid: ticketId,
                    purchasePoints: null,
                    purchaseTimeStamp: null,
                    clientPoints: null,
                });
            return next(error);
        });



}

function getPromo(req, res, next) {
    /*
    Estructura de ejemplo:

        <ticket>
            <importe> 24.56 </importe>
            <combustible> Diesel Plus </combustible>
            <ticketid>12345</ticketid>
        </ticket>

    Versión JSON:
        {
            "ticket": {
                "importe": [
                    "24.56"
                ],
                "combustible": [
                    "Diesel Plus"
                ],
                "ticketid": [
                    "12345"
                ]
            }
        }
    */
    const {
        importe
    } = req.body.ticket;
    const {
        combustible
    } = req.body.ticket;
    const {
        ticketid
    } = req.body.ticket;

    const query = 'UPDATE public.tickets AS t2 SET ticketid=$1, reglaid=(SELECT r.Regla_ID__c FROM salesforce.regla__c AS R,public.tickets AS t WHERE t.promocion = r.promocion__r__promo_id__c AND t.ticketid IS NULL AND (coalesce(r.combustible__c,$2)=$2 ) AND ((r.operador__c =\'Mayor\' AND $3 > r.importe__c ) OR (r.operador__c =\'Menor\' AND $3 < r.importe__c ) OR (r.importe__c IS null)) AND t.promoid = t2.promoid ORDER BY r.prioridad__c, t.promoid LIMIT 1) , delivered_Date = now() WHERE t2.promoid = ( SELECT t.promoid FROM public.tickets AS T, salesforce.regla__c AS R WHERE t.promocion = r.promocion__r__promo_id__c AND t.ticketid IS NULL AND (coalesce(r.combustible__c,$2)=$2 ) AND ((r.operador__c =\'Mayor\' AND $3 > r.importe__c ) OR (r.operador__c =\'Menor\' AND $3 < r.importe__c ) OR (r.importe__c IS null)) ORDER BY r.prioridad__c, t.promoid LIMIT 1) RETURNING t2.promoid AS PROMOID, t2.ticketid AS TICKETID';

    db.one('UPDATE public.tickets AS t2 SET ticketid=$1, reglaid=(SELECT r.Regla_ID__c FROM salesforce.regla__c AS R,public.tickets AS t WHERE t.promocion = r.promocion__r__promo_id__c AND t.ticketid IS NULL AND (coalesce(r.combustible__c,$2)=$2 ) AND ((r.operador__c =\'Mayor\' AND $3 > r.importe__c ) OR (r.operador__c =\'Menor\' AND $3 < r.importe__c ) OR (r.importe__c IS null)) AND t.promoid = t2.promoid ORDER BY r.prioridad__c, t.promoid LIMIT 1) , delivered_Date = now() WHERE t2.promoid = ( SELECT t.promoid FROM public.tickets AS T, salesforce.regla__c AS R WHERE t.promocion = r.promocion__r__promo_id__c AND t.ticketid IS NULL AND (coalesce(r.combustible__c,$2)=$2 ) AND ((r.operador__c =\'Mayor\' AND $3 > r.importe__c ) OR (r.operador__c =\'Menor\' AND $3 < r.importe__c ) OR (r.importe__c IS null)) ORDER BY r.prioridad__c, t.promoid LIMIT 1) RETURNING t2.promoid AS PROMOID, t2.ticketid AS TICKETID',
            [ticketid, combustible, importe])
        .then((data) => {
            res.status(200)
                .json({
                    status: 'success',
                    data,
                    message: 'Ticket Procesado'
                });
        })
        .catch((err) => {
            return next(err);
        });



}

module.exports = {
    getCustomer,
    getSimulation,
    newCompra,
    redeem,
    getPromo
};