
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json()); //Needed to process incoming JSON(application/json) messages.

// Catagories library
const catagories = [
    {id: 1, name:"Drama"},
    {id: 2, name:"Action"},
    {id: 3, name:"Romance"},
    {id: 4, name:"Sci-Fi"},
    {id: 5, name:"Musical"},
];

//app setup to listen to correct port.
const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listening on port ${port}`));


//get all catagories
app.get('/api/catagories', (req,res)=>{
    res.send(catagories);
})


//get specific catagorie
app.get('/api/catagories/:id', (req,res) =>{
    const catagorie = catagories.find(c => c.id === parseInt(req.params.id));
    if(!catagorie) return res.status(404).send("requested id not found");

    res.send(catagorie);
});


//add catagorie
app.post('/api/catagories', (req,res) =>{
    const {error} = validateCatagorie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const catagorie = {
        id: catagories.length +1,
        name: req.body.name,
    };
    catagories.push(catagorie);
    res.send(catagorie);
});

//update catagorie
app.put('/api/catagories/:id', (req,res) =>{
    //Find ID
    const catagorie = catagories.find(c => c.id === parseInt(req.params.id));
    if(!catagorie) return res.status(404).send("requested id not found");
    //Validate body
    const {error} = validateCatagorie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Update 
    catagorie.name = req.body.name;
    //respond
    res.send(catagorie);
});

app.delete('/api/catagories/:id', (req,res)=>{
    const catagorie = catagories.find(c => c.id === parseInt(req.params.id));
    if(!catagorie) return res.status(404).send("requested id not found");

    const index = catagories.indexOf(catagorie);
    catagories.splice(index,1);

    res.send(catagorie);
});




function validateCatagorie(catagorie){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(catagorie,schema)

}
