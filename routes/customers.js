const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = server => {
    // Get Customers
    server.get('/customers' , async (req, res, next) => {
        try {
            const customers = await Customer.find({});
            // console.log(req);
            res.send(customers);
            next();   
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    // Get Single Customer
    server.get('/customer/:id', async(req, res, next) => {
        try {
            const customer = await Customer.findById(req.params.id);
            res.send(customer);
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`There is no Customer with the id of: ${req.params.id}`));
        }
    });

    // Add Customer
    server.post('/customers', async (req, res, next) => {
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expect 'application/json'"));
        }

        const { name, email, balance } = req.body;

        const customer = new Customer({
            name: name,
            email: email,
            balance: balance
        });

        try{
            const newCustomer = await customer.save();
            res.send(201);
            next();
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }

    });

    server.put('/customer/:id', async (req, res, next) => {
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Express 'application/json'"));
        }

        try{
            const customer = await Customer.findOneAndUpdate({
                _id: req.params.id
            }, req.body);
            res.send(200);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(
                `There is no customer with the id of ${req.params.id}`
            ));
        }

    });

    // Delete Customer
    server.del('/customer/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findOneAndRemove({
                _id: req.params.id
            });     
            res.send(204);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(
                `There is no customer with the id of ${req.params.id}`
            ));
        }
    });
};