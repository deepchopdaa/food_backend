const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
require('./config.js')
/* models */
const users = require('./model/user.model.js')
const restrurent = require('./model/admin/restrorent.js');
const category = require('./model/admin/category.js')
const foodItem = require('./model/admin/foodItem.js')
/* models */
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
const secrate_key = "secratekey";

/* login register with token  start */
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
        } else {
            res.send("password is incorrect")
        }
    }).catch(() => {
        res.send("user not found");
    })
});

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

/* login register with token end */



/* Admin restrurent curd start */

app.post("/addrestrurent", async (req, res) => {
    let { name, address, area } = req.body;
    if (name && address && area) {
        let data = await restrurent.create({ name, address, area });
        console.log(data)
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

app.get("/getrestrurent", async (req, res) => {
    let data = await restrurent.find();
    console.log(data);
    res.send(data)
})

app.put("/updaterestrurent/:id", async (req, res) => {
    let id = req.params.id;
    let { name, address, area } = req.body;
    if (name && address && area) {
        let data = await restrurent.findByIdAndUpdate(id, { name, address, area }, { new: true });
        console.log(data);
        res.send(data);
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

app.delete("/deleterestrurent/:id", async (req, res) => {
    let id = req.params.id;
    let data = await restrurent.findByIdAndDelete(id);
    res.send(data);
    console.log(data);
})


/* Admin restrurent curd end */


/* Admin category crud start */

app.get("/getcategory", async (req, res) => {
    let data = await category.find();
    res.send(data);
    console.log(data)
})


app.post("/addcategory", async (req, res) => {
    let { category_name, status } = req.body;
    if (category_name) {
        let data = await category.create({category_name,status});
        console.log(data);
        res.send(data);
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

app.put("/updatecategory/:id", async (req, res) => {
    let id = req.params.id;
    let { category_name, status } = req.body;
    if (category_name && status) {
        let data = await category.findByIdAndUpdate(id, { category_name, status }, { new: true });
        console.log(data);
        res.send(data)
    } else {
        res.send("enter all required feild")
        console.log("enter all required feild")
    }
})

app.delete("/deletecategory/:id", async (req, res) => {
    let id = req.params.id;
    let data = await category.findByIdAndDelete(id);
    console.log(data);
    res.send(data);
})
/* Admin category crud end */

/*  food item crud start  */

app.get("/getfood", async (req, res) => {
    let data = await foodItem.find();
    console.log(data);
    res.send(data)
})

app.post("/addfood", async (req, res) => {
    let { item_name, description, image_url, price, status, quantity } = req.body;
    if (item_name && description && image_url && price && status && quantity) {
        let data = await foodItem.create(req.body);
        res.send(data);
        console.log(data)
    } else {
        res.send("enter all required feild");
        console.log("enter all required feild");
    }
})

app.put("/updatefood/:id", async (req, res) => {
    let id = req.params.id;
    let { item_name, description, image_url, price, status, quantity } = req.body;
    if (item_name && description && image_url && price && status && quantity) {
        let data = await foodItem.findByIdAndUpdate(id, { item_name, description, image_url, price, status, quantity }, { new: true });
        res.send(data);
        console.log(data)
    }
})

app.delete("/deletefood/:id", async (req, res) => {
    let id = req.params.id;
    let data = await foodItem.findByIdAndDelete(id);
    console.log(data)
    res.send(data)
})

/* food item crud end  */

app.listen(port, () => {
    console.log(`app is running on ${port}`)
})