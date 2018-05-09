var promise = require('bluebird');

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


module.exports = {
    getCustomer: getCustomer
};

