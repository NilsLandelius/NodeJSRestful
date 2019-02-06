const request = require('supertest');
const {Genre} = require('../../models/genre');
let server;

describe('api/genres',()=>{
    /**
     * Because you need server for each test, once you've called it in the first test it needs to be closed. 
     * Otherwise when the second test calls server there will be a conflict-error where an existing server is already
     * running on port 3000. With BeforeEach and AfterEach, the server will be defined ahead of test execution, and 
     * closed after each test is done, avoiding a conflict-error on port 3000. 
     */
    beforeEach(()=> {server = require('../../index')});
    afterEach(async ()=>{
        server.close(); 
        await Genre.deleteMany({});
    });

        describe('GET /',()=>{
        it('should return all genres',async ()=>{
           await Genre.collection.insertMany([
                {name:"genre1"},
                {name:"genre2"}
            ]);
            
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
        })
    });
        describe('GET /:id', ()=>{
        it('Should return a genre if a valid id is passed',async ()=>{
            const genre = new Genre({name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/'+ genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',genre.name);

        })
        it('Should return 404 if a invalid id is passed',async ()=>{
            
            const res = await request(server).get('/api/genres/w1');

            expect(res.status).toBe(404);

        })
    })  
});