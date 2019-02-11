const request = require('supertest');
const {User} = require("../../models/user");
const {Genre} = require('../../models/genre');


describe('auth middleware', ()=>{
    beforeEach(()=> {server = require('../../index')});
    afterEach(async ()=>{
        await Genre.deleteMany({});
        server.close();
    }); 

    token = "";
    //exec returns the promise from request, so instead of awaiting here, we await in the test. 
    const exec = ()=>{
        return request(server)
        .post('/api/genres')
        .set("x-auth-token",token)
        .send({name: "genre1"})
    };

    beforeEach(async ()=>{
        token = await new User().generateAuthToken();
    });

    it('Should return a 401 status if no token is provided', async ()=>{
        token = "";
        const res = await exec();

        expect(res.status).toBe(401);
    });
    it('Should return a 400 status if token is invalid', async ()=>{
        token = "tokenisinvalid";
        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('Should return a 200 status if token is valid', async ()=>{
        const res = await exec();

        expect(res.status).toBe(200);
    });
});