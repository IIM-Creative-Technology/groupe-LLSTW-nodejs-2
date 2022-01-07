const express = require('express');
const app = express();
const port = 3001;
const middleware = require('./middleware')
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser")
const mongoose = require("./database");
const session = require("express-session");
const Message = require('./schemas/MessageSchema');


const server = app.listen(port, () => console.log("Server listening on port " + port, "http://localhost:" + port));
const io = require('socket.io')(server, { pingtimeout : 60000 });

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.options('*', cors());

app.use(session({
    secret: "IIM",
    resave: true,
    saveUninitialized: false
}))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes');


app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);

app.get("/", middleware.requireLogin, async (req, res, next) => {
    let result = await Message.find({}).sort({datefield: -1})
    var payload = {
        pageTitle: "Messagerie",
        userLoggedIn: req.session.user,
        messages: result
    }

    res.status(200).render("home", payload);
})

app.get('/api/messages', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
        let result = await Message.find({}).sort({datefield: -1})
        res.send(result);
});

app.post('/api/messages/create', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const content = req.body.content;
    const username = req.session.user.username;

    //console.log(content);
    //console.log(username);

    if (content) {
        const message = new Message({
            content: content,
            username: username
        });
        message.save();
        res.status(200).send("Message created");
    } else {
        res.status(422).send('incomplete data');
    }
});

// io user connected
io.on('connection', (socket) => {
    console.log('Utilisateur connecté');

    socket.on('chatMessage', (message) => {
        // let result =  Message.find({});
        console.log("Message socket", message);
        socket.emit('insertMessage', message);
        console.log('message envoyé');
});

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});

