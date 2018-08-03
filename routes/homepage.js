
const express = require('express').Router();
const router = express;



router.get('/', (req,res) =>{
    res.render("index",{title:"My page",message:"Hello World!"});
});

module.exports = router;