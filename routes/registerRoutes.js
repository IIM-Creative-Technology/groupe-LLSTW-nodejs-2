const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    res.status(200).render("register");
})

router.post("/", async (req, res, next) => {
    var username = req.body.username.trim();
    var password = req.body.password;

    var payload = req.body;

    if(username && password) {
        var user = await User.findOne({ username: username })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "oOoOoOo.";
            res.status(200).render("register", payload);
        });
        if(user == null) {
            var data = req.body;
            data.password = await bcrypt.hash(password, 12);
            User.create(data)
            .then((user) => {
                req.session.user = user;
                return res.redirect("/");
            })
        }
        else {
            payload.errorMessage = "Le nom d'utilisateur existe déjà.";
            res.status(200).render("register", payload);
        }
    }
    else {
        payload.errorMessage = "Avoir un nom d'utilisateur et un mot de passe est obligatoire.";
        res.status(200).render("register", payload);
    }
})

module.exports = router;