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
    db.one('select case R.TXT_Factor_Type__c '+
           ' WHEN \'Fijo\' '+
           ' THEN R.NUM_Factor_value__C WHEN \'%\''+
           ' THEN R.NUM_Factor_value__C * $4 END LIKES,' +
           ' R.name, '+
           ' A.loyalty_point_qty__c '+
           'from salesforce.account a, salesforce.rules_execution__c R, salesforce.producto__c P '+
           'where a.external_id__C = $1'+
           ' and R.lkp_customerid__c = A.sfid and coalesce(R.TXT_store__C, $2) = $2'+
           ' and P.sfid = coalesce(R.LKP_ProductID__c, P.sfid) and P.Referencia__c = $3'
        ,[clientId,storeId,productId,amount])
        .then(function (data) {
            console.log('Aplicando regla ' + data.name + ' Timestamp: ' + Date.now().toString());
            var d = new time.Date();
            d.setTimezone('Europe/Madrid');
            res.status(200)
                .json({
                    status: 'OK',
                    message: 'OK',
                    ticketid: req.body.ticket.ticketId,
                    purchasePoints: data.likes,
                    purchaseTimeStamp: d.toString(),
                    clientPoints: data.loyalty_point_qty__c
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

