//user can post something
//login and reguster
//logout
//post create
//post like
//post delete


const express = require('express');
const app = express();
const UserModel = require('./models/user');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken")

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const bcrypt = require('bcrypt')


app.get('/', (req,res) => {
    res.render("index");
})

app.post('/register', async (req, res) => {
    let {email, password, username, name, age} = req.body;

    let user = await userModel.findOne({email})
    if(user) return res.status(500).send("User already exist")

    bcrypt.genSalt(10, (err, salt) => {
        bcyrpt.hash(password, salt, async (err, hash) => {
        let user = await userModel.create({
            email,
            age,
            name,
            password: hash
        });

        jwt.sign({email: email, userid: user._id}, "shhh");
        })
    })
})

app.listen(3000)