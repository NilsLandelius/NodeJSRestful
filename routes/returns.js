const {Rental,validate} = require('../models/rental');
const express = require('express');
const router = express.Router();


router.post('/', async(req, res) => {
    const { error } = validate(req.body)
    if(error) return res.status(400).send('Missing customer or movie Id');

    const rental = await Rental.findOne({
        "customer._id": req.body.customerId,
        "movie._id": req.body.movieId
    });
    if(!rental) return res.status(404).send("Rental not found");

    if(rental.dateReturned) return res.status(400).send('Rental already returned');

     res.status(401).send('Unauthorized')
});

module.exports = router;