const routes = require('express').Router();
const swagger = require('./swagger');

routes.get('/', (req, res) => {
    res.status(200).send(
        {
            message: "Hello World"
        }
    )
})
routes.use('/api-docs', swagger);
module.exports = routes;