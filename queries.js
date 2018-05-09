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
/*
module.exports = {
    getAllPuppies: getAllPuppies,
    getSinglePuppy: getSinglePuppy,
    createPuppy: createPuppy,
    updatePuppy: updatePuppy,
    removePuppy: removePuppy
};
*/