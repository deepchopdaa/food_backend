const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
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

/* login and register user with token */
function verifytoken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    console.log(bearerHeader)
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        console.log(bearer)
        const token = bearer[1];
        req.token = token
        next();
    } else {
        res.send({
            result: "token is unvalid"
        })
    }
}

app.post('/profile', verifytoken, (req, res) => {
    jwt.verify(req.token, secrate_key, (err, authData) => {
        if (err) {
            res.send({ result: "token is invalid" })
        } else {
            res.json({
                message: 'profile accesed',
                authData
            })
        }
    })
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
})

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

/* end login and register user with token */

/* admin  */

/* restaurant crud */
app.get("/restaurantget", async (req, res) => {
    let data = await restrorent.find();
    res.send(data);
    console.log(data);
})

app.post("/addrestrorent", async (req, res) => {
    const { area, address, name } = req.body;
    if (area && address && name) {
        let data = await restrorent.create(req.body);
        res.send(data);
        console.log(data);
    }
})

app.put("/updaterestrorent/:id", async (req, res) => {
    const { name, address, area } = req.body;
    const id = req.params.id
    let data = await restrorent.findByIdAndUpdate(id, { name, address, area }, { new: true });
    res.send(data);
    console.log(data);
})

app.delete("/deleterestrorent/:id", async (req, res) => {
    const id = req.params.id
    const data = await restrorent.findByIdAndDelete(id);
    console.log(data);
    res.send(data)
})

/* restaurants crud end */

/* category of item curd */

app.get('/getcategory', async (req, res) => {
    let data = await category.find();
    res.send(data);
    console.log(data);
})

app.post('/addcategory', async (req, res) => {
    let data = await category.create(req.body);
    res.send(data);
    console.log(data)
})

app.put("/updaterestrorent/:id", async (req, res) => {
    const { name, address, area } = req.body;
    const id = req.params.id
    let data = await restrorent.findByIdAndUpdate(id, { name, address, area }, { new: true });
    res.send(data);
    console.log(data);
})

app.put('/updatecategory/:id', async (req, res) => {
    const { category_name, status } = req.body;
    const id = req.params.id
    let data = await category.findByIdAndUpdate(id, { category_name, status }, { new: true });
    res.send(data);
    console.log(data);
})

app.delete('/deletecategory/:id', async (req, res) => {
    let id = req.params.id;
    let data = await category.findByIdAndDelete(id);
    res.send(data);
    console.log(data)
})

/* category of item end */
app.listen(port, () => {
    console.log(`app is running on ${port}`)
})