const {Rental} = require('../../models/rental')
const {User} = require('../../models/user')
const {Movie} = require('../../models/movie')
const mongoose = require('mongoose');
const moment = require('moment');
const request = require('supertest');

describe('/api/returns',()=>{
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec = () =>{
        return request(server)
        .post('/api/returns/')
        .set('x-auth-token',token)
        .send({customerId,movieId});
    };

    beforeEach(async ()=> {
        server = require('../../index')
        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        
        movie = new Movie({
            _id: movieId,
            title: "Alita - Battle Angel",
            genre: {name: "12345"},
            dailyRentalRate: 50,
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer:{
                _id: customerId,
                name: "Nisse",
                phone: "12345"
            },
            movie:{
                _id: movieId,
                title: "Alita - Battle Angel",
                dailyRentalRate:50
            }
        });
       await rental.save(); 
    });
    afterEach(async ()=>{
        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await server.close(); 
    });

    it('Should return 401 if client is not logged in',async ()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('Should return 400 if customerId is not provided',async ()=>{
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('Should return 400 if movieId is not provided',async ()=>{
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('Should return 404 if no rental found for this customer or movie',async ()=>{
        await Rental.deleteMany({});

        const res = await exec();

        expect(res.text).not.toBeNull();
        expect(res.status).toBe(404);
    });
    it('Should return 400 if return already processed',async ()=>{
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('Should return 200 if valid request',async ()=>{
        const res = await exec();

        expect(res.status).toBe(200);
    });
    it('Should set returnDate if input is valid',async ()=>{
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDB.dateReturned;
        //expect difference to be less then 10 seconds
        expect(diff).toBeLessThan(10 * 1000);
    });
    it('Should return rental fee if input is valid',async ()=>{
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save();
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);

        expect(rentalInDB.rentalFee).toBe(350);
    });
    it('Should increase movie stock if input is valid',async ()=>{
        const res = await exec();

        const movieInDB = await Movie.findById(movieId);

        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });
    it('Should return rental if input is valid',async ()=>{
        const res = await exec();
        
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'dateOut','dateReturned','rentalFee','customer','movie']));
    });
});