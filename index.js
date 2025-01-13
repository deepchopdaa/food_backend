const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
require('./config.js')
const users = require('./model/user.model.js')
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
const secrate_key = "secratekey";
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
    };
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
}
app.post('/profile', verifytoken, (req, res) => {
    console.log("porfile accesed")
})

app.post('/login', async (req, res) => {
    users.findOne({ email: req.body.email }).then((user) => {
        const id = user._id
        if (user.password === req.body.password) {
            jwt.sign({ id }, secrate_key, { expiresIn: '1200s' }, (err, token) => {
                res.json({ token })
            })
        }else{
            res.send("password is incorrect")
        }
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
            const password = req.body.password
            const hashpassword = async (password) => {
                const round = 10;
                const hashpassword = await bcrypt.hash(password, round)
                return hashpassword
            }
            hashpassword(password)
                .then(hashed => {
                    console.log("hashed passwood", hashed)
                    req.body.password = hashed
                });
        }
        users.create(req.body).then((data) => {
            res.status(201).send(data)
        }).catch((err) => {
            console.log(err);
            res.status(500).send(`error ${err}`)
        })
    })
})

app.listen(port, () => {
    console.log(`app is running on ${port}`)
})