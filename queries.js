var promise = require('bluebird');
var time = require('time');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;
pgp.pg.defaults.ssl = true;
var db = pgp(connectionString);
console.log('Conectado a la BBDD');
// add query functions

function getCustomer(req, res, next) {
    console.log('Iniciando getCustomer');
    var customer = parseInt(req.params.id);
    db.one('select * from test where B = $1', customer)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ONE Customer'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getSimulation(req, res, next) {
    console.log('Iniciando getSimulation');
    var clientId  = req.body.clientId;
    var productId = req.body.ticket.productId;
    var storeId = req.body.ticket.storeId;
    var amount = req.body.ticket.ticketAmount;
    console.log('Parametros: '+clientId+' '+productId+' '+storeId+' '+amount);
    const likes = 'likes(\'' + clientId + '\',\'' + storeId + '\',\''+ productId+'\','+amount+')';
    console.log('funcion: '+likes);
    db.one('SELECT * FROM $1:raw', likes)
   // db.one('select * from likes($1,$2,$3,$4)',[clientId,storeId,productId,amount])
        .then(function (data) {
            console.log('Aplicando regla ' + data.rule + ' Timestamp: ' + Date.now().toString());
            var d = new time.Date();
            d.setTimezone('Europe/Madrid');
            res.status(200)
                .json({
                    status: 'OK',
                    message: 'Aplicada regla: ' + data.rule,
                    ticketid: req.body.ticket.ticketId,
                    purchasePoints: data.likes,
                    purchaseTimeStamp: d.toString(),
                    clientPoints: data.total_likes
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function newCompra(req, res, next) {
    console.log('Iniciando newCompra');
    var clientId = req.body.clientId;
    var email = req.body.email;
    var storeId = req.body.ticket.storeId;
    var loyaltyEan = req.body.loyaltyEan;
    var ticketAmount = req.body.ticket.ticketAmount;
    var ticketTimestamp = req.body.ticket.ticketTimestamp;
    var ticketId = req.body.ticket.ticketId;
    var lineas = req.body.ticket;
    const newTicket = 'new_ticket(\'' + clientId + '\',\'' + storeId + '\',\'' + email + '\',\'' + loyaltyEan + '\','
                                  +ticketAmount + ',\'' + ticketTimestamp + '\',\''+ticketId + '\',' + lineas + ')';
    console.log('funcion: ' + newTicket);
    db.one('select * from new_ticket($1,$2,$3,$4,$5,$6,$7,$8::json)', [clientId, storeId, email, loyaltyEan, ticketAmount, ticketTimestamp, ticketId, lineas])
        .then(data => {
            console.log('Guardando ticket: ' + ticketId);    
            console.log('DAtos: '+data.length);
            var d = new time.Date();
            d.setTimezone('Europe/Madrid');
            res.status(200)
                .json({
                    status: 'OK',
                    message: 'Ticket Guardado: ' + ticketId,
                    ticketid: ticketId,
                    purchasePoints: data.total_amount,
                    purchaseTimeStamp: d.toString(),
                    clientPoints: data.clientpoints
                });
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        });
}

function newRedencion(req, res, next) {
    console.log('Iniciando getSimulation');
    var clientId = req.body.clientId;
    var productId = req.body.ticket.productId;
    var storeId = req.body.ticket.storeId;
    var amount = req.body.ticket.ticketAmount;
    console.log('Parametros: ' + clientId + ' ' + productId + ' ' + storeId + ' ' + amount);
    const likes = 'likes(\'' + clientId + '\',\'' + storeId + '\',\'' + productId + '\',' + amount + ')';
    console.log('funcion: ' + likes);
    db.one('SELECT * FROM $1:raw', likes)
        // db.one('select * from likes($1,$2,$3,$4)',[clientId,storeId,productId,amount])
        .then(function (data) {
            console.log('Aplicando regla ' + data.rule + ' Timestamp: ' + Date.now().toString());
            var d = new time.Date();
            d.setTimezone('Europe/Madrid');
            res.status(200)
                .json({
                    status: 'OK',
                    message: 'Aplicada regla: ' + data.rule,
                    ticketid: req.body.ticket.ticketId,
                    purchasePoints: data.likes,
                    purchaseTimeStamp: d.toString(),
                    clientPoints: data.total_likes
                });
        })
        .catch(function (err) {
            return next(err);
        });
}


module.exports = {
    getCustomer: getCustomer,
    getSimulation: getSimulation,
    newCompra: newCompra,
    newRedencion: newRedencion
};

