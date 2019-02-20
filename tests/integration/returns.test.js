const {Rental} = require('../../models/rental')
const {User} = require('../../models/user')
const mongoose = require('mongoose');
const request = require('supertest');

describe('/api/returns',()=>{
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    const exec = () =>{
        return request(server)
        .post('/api/returns/')
        .set('x-path-token',token)
        .send({customerId,movieId});
    };

    beforeEach(async ()=> {
        server = require('../../index')
        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        
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
        //TODO
    });
});