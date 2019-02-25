const {Rental,validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const moment = require('moment');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();


router.post('/',auth, async(req, res) => {
    const { error } = validate(req.body)
    if(error) return res.status(400).send('Missing customer or movie Id');

    const rental = await Rental.findOne({
        "customer._id": req.body.customerId,
        "movie._id": req.body.movieId
    });
    if(!rental) return res.status(404).send("Rental not found");

    if(rental.dateReturned) return res.status(400).send('Rental already returned');

    //Set the dateReturned and calculate the rental Fee
    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate
    await rental.save();

    //Update the movie-object by incrementing the number in stock by one
    await Movie.update({_id: rental.movie._id},{
        $inc: {numberInStock: 1}
    });

    return res.status(200).send(rental);
});

module.exports = router;