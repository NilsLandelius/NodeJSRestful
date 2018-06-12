
const express = require('express');
const Joi = require('joi');
const router = express.Router();

const catagories = [
    {id: 0, name:"Drama"},
    {id: 1, name:"Action"},
    {id: 2, name:"Romance"},
    {id: 3, name:"Sci-Fi"},
    {id: 4, name:"Musical"},
];

router.get('/videos', (req,res) =>{
    res.render("index",{title:"My page",message:"Hello World!"});
});

//get all catagories
router.get('/', (req,res)=>{
    res.send(catagories);
});


//get specific catagorie
router.get('/:id', (req,res) =>{
    const catagorie = catagories.find(c => c.id === parseInt(req.params.id));
    if(!catagorie) return res.status(404).send("requested id not found");

    res.send(catagorie);
});


//add catagorie
router.post('/', (req,res) =>{
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
router.put('/:id', (req,res) =>{
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

router.delete('/:id', (req,res)=>{
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
    return Joi.validate(catagorie,schema);

}

module.exports = router;