//user can post something
//login and reguster
//logout
//post create
//post like
//post delete


const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require("./models/post")
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

app.get('/login', (req,res) => {
    res.render("login");
})

app.get('/profile', isLoggedIn, (req,res) => {
    console.log(req.user)
    res.render("login");

})

app.post('/register', async (req, res) => {
    let {email, password, username, name, age} = req.body;

    let user = await userModel.findOne({email})
    if(user) return res.status(500).send("User already exist")

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
        let user = await userModel.create({
            email,
            age,
            name,
            password: hash
        });

        let token = jwt.sign({email: email, userid: user._id}, "shhh");
        res.cookie("token", token)
        res.send("registered");
        })
    })
})

app.post('/login', async (req, res) => {
    let {email, password} = req.body;

    let user = await userModel.findOne({email})
    if(!user) return res.status(500).send("Something Went Wrong")

        bcrypt.compare(password, user.password, (err, result)=>{
            if(result){
                let token = jwt.sign({email: email, userid: user._id}, "shhh");
                res.cookie("token", token);
                res.status(200).send("you can login");
            }
            else res.redirect("/login"); 
        })

});

app.get('/logout', (req, res) =>{
    res.cookie("token", "")
    res.redirect("login")
});

function isLoggedIn(req, res ,next){
    if(req.cookies.token === "") res.send("you must be logged in ");
    else{
        let data = jwt.verify(req.cookies.token, "shhh");
        req.user = data;
        next();
    }

}

app.listen(3000)