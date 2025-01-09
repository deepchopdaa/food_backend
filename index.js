const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('./config.js')
const user = require('./model/user.model.js')
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
const secrate_key = "secratekey"

function verifytoken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    console.log(bearerHeader)   
    if (typeof bearerHeader !== 'undefined') {
        const bearer =  bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token
        next();
    } else {
        res.send({
            result: "token is unvalid"
        })
    }
}

app.post('/profile',verifytoken,(req,res)=>{
    jwt.verify(req.token,secrate_key,(err,authData)=>{
        if(err){
            res.send({result:"token is invalid"})
        }else{
            res.json({
                message:'profile accesed',
                authData
            })
        }
    })
})

app.post('/login', async (req, res) => {
    const user = {
        id: 1,
        name: "ram",
        email: "csfgrg@vfg.ged"
    }
    jwt.sign({ user }, secrate_key, { expiresIn: '1200s' }, (err, token) => {
        res.json({ token })
    })
})

const verification = () => {

}

app.get("/get", async (req, res) => {
    res.send("data getted");
})
app.post("/insert", async (req, res) => {
    let data = await user.create(req.body);
    res.send(data);
    console.log(data);
})
app.listen(port, () => {
    console.log(`app is running on ${port}`)
})