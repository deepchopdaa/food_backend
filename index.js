const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
require('./config.js')
/* models */
const restrorent = require('./model/admin/restrorent.js')
const users = require('./model/user.model.js')
const category = require('./model/admin/category.js')
const fooditem = require('./model/admin/foodItem.js')
/* models */
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
const secrate_key = "secratekey"

function verifytoken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    console.log(bearerHeader, "yhgfuyg")
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        console.log(bearer)
        const token = bearer[1];
        req.token = token;
    } else {
        res.send({
            result: "token is unvalid"
        })
    }
}

app.post('/profile', verifytoken, (req, res) => {
    jwt.verify(req.token, secrate_key, (err, authData) => {
        if (err) {
            res.send({ result: "Unauthorize user" })
        } else {
            res.json({
                message: 'profile accesed',
                authData
            })
        }
    })
    next();
})
app.post('/profile', verifytoken, (req, res) => {
    console.log("porfile accesed")
})

app.post('/login', async (req, res) => {
    users.findOne({ email: req.body.email }).then((user) => {
        const id = user._id
        jwt.sign({ id }, secrate_key, { expiresIn: '1200s' }, (err, token) => {
            res.json({ token })
        })
    }).catch(() => {
        res.send("user not found");
    })
});
app.get("/get", async (req, res) => {
    res.send("data getted");
})
app.post("/insert", async (req, res) => {
    users.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).send(`An account with the email ${req.body.email} already exists`)
        } else {
            users.create(req.body).then((data) => {
                res.status(201).send(data)
            }).catch((err) => {
                console.log(err);
                res.status(500).send(`error ${err}`)
            })
        }
    })
})
app.listen(port, () => {
    console.log(`app is running on ${port}`)
})