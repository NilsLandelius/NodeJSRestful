const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');


describe('api/genres',()=>{
    /**
     * Because you need server for each test, once you've called it in the first test it needs to be closed. 
     * Otherwise when the second test calls server there will be a conflict-error where an existing server is already
     * running on port 3000. With BeforeEach and AfterEach, the server will be defined ahead of test execution, and 
     * closed after each test is done, avoiding a conflict-error on port 3000. 
     */
    beforeEach(()=> {server = require('../../index')});
    afterEach(async ()=>{
        await Genre.deleteMany({});
        await server.close(); 
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
        });
    });
        describe('GET /:id', ()=>{
        it('Should return a genre if a valid id is passed',async ()=>{
            const genre = new Genre({name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/'+ genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',genre.name);

        });
        it('Should return 404 if a invalid id is passed',async ()=>{
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);

        });
        it('Should return 404 if no genre with the given id exists',async ()=>{
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/'+id);

            expect(res.status).toBe(404);

        });
    });
        describe('POST /',()=>{

            /**
             * Refactoring tests, extracting the post of a happy case, then creating variables for the 
             * token and name properties sent. This will allow for changing the variables inside tests
             * when needed in order to change the exec-functions call. Then use the beforeEach-function
             * to reset the name and token variables to acceptable paramters before each test.
             */
            let token;
            let name;

            const exec = async()=>{
             return await request(server)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name:name});
            }; 

            beforeEach(async ()=>{
                token = await new User().generateAuthToken();
                name = 'genre1';
            });

            it('Should return a 401 if client is not logged in',async()=>{
                token = '';
                const res = await exec();
                expect(res.status).toBe(401);
                
            });
            it('Should return a 400 if genre is less then 5 characters',async()=>{
                name = '1234';

                const res = await exec();
                
                expect(res.status).toBe(400);
                
            });
            it('Should return a 400 if genre is more then 50 characters',async()=>{
                name = new Array(52).join('a');

                const res = await exec();
                
                expect(res.status).toBe(400);
                
            });
            it('Should save the genre if it is valid',async()=>{
                await exec();
                
                const genre = await Genre.find({name:name});
                expect(genre).not.toBeNull();
                
            });
            it('Should return the genre if it is valid',async()=>{

                const res = await exec();
                
                expect(res.body).toHaveProperty('_id');
                expect(res.body).toHaveProperty('name','genre1');
                
            });
        });
        describe('PUT /:id',()=>{
            let id;
            let name;

            const exec = async () =>{
               return await request(server)
                .put('/api/genres/'+id)
                .send({name:name})
            };
            beforeEach(()=>{
                id =mongoose.Types.ObjectId();
                name = 'genreName2'
            });

            it('Should return 404 if genre id is invalid', async ()=>{
                const res = await request(server).put('/api/genres/1');
                expect(res.status).toBe(404);
            });
            it('Should return 400 if genre name is invalid', async ()=>{
                name = '1'
                const res = await exec();
                expect(res.status).toBe(400);
            });
            it('Should return 404 if genre id is not found', async ()=>{
                const res = await exec();
                expect(res.status).toBe(404);
            });
            it('Should return updated genre if genre id is found', async ()=>{
                const genre = new Genre({_id:id, name:"genreName1"});
                await genre.save();

                const res = await exec();
                expect(res.status).toBe(200);
                expect(res.body.name).toBe(name);
            });
        });
        describe('DELETE /:id',()=>{
            let id;
            let token;
            let admin;
            const exec = async ()=>{
               return await request(server)
               .delete('/api/genres/'+id)
               .set('x-auth-token',token)
            };
            beforeEach(async ()=>{
                id = mongoose.Types.ObjectId();
                admin = true;
                token = await new User({isAdmin:admin}).generateAuthToken();
                
            });
            it('Should return 404 if genre was not found',async ()=>{
                const res = await exec();
                expect(res.status).toBe(404);
            });
            it('Should return 403 if not admin',async ()=>{
                token = await new User({isAdmin:false}).generateAuthToken();
                const res = await exec();
                expect(res.status).toBe(403);
            });
            it('Should return genre if id was found',async ()=>{
                const genre = await new Genre({_id:id,name:"genre1"}); 
                await genre.save();

                const res = await exec();
                expect(res.status).toBe(200);
                expect(res.body.name).toBe("genre1");
            });

        });  
});