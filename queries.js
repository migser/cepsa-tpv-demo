var promise = require('bluebird');
var time = require('time');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL;
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
    const likes = 'likes(' + clientId + ',' + storeId + ','+ productId+','+amount+')';
    db.one('SELECT * FROM foo($1:raw)', p)
   // db.one('select * from likes($1,$2,$3,$4)',[clientId,storeId,productId,amount])
        .then(function (data) {
            console.log('Aplicando regla ' + data.rule + ' Timestamp: ' + Date.now().toString());
            var d = new time.Date();
            d.setTimezone('Europe/Madrid');
            res.status(200)
                .json({
                    status: 'OK',
                    message: 'OK',
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
    getSimulation: getSimulation
};

