const {Rental,validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const moment = require('moment');
const express = require('express');
const validator = require('../middleware/validate');
const auth = require('../middleware/auth');
const router = express.Router();


router.post('/',[auth,validator(validate)], async(req, res) => {
    const rental = await Rental.lookup(req.body.customerId,req.body.movieId);

    if(!rental) return res.status(404).send("Rental not found");

    if(rental.dateReturned) return res.status(400).send('Rental already returned');

    //Set the dateReturned and calculate the rental Fee
    rental.return()
    await rental.save();


    //Update the movie-object by incrementing the number in stock by one
    await Movie.update({_id: rental.movie._id},{
        $inc: {numberInStock: 1}
    });

    return res.send(rental);
});

module.exports = router;