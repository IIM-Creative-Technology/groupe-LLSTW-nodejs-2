const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://admin:GGcKhq1N7zP2nYMM@iim.lmpec.mongodb.net/IIM?retryWrites=true&w=majority")
        .then(() => {
            console.log("Connecté à la base de données");
        })
        .catch((err) => {
            console.log("Erreur de connexion à la base de données : " + err);
        })
    }
}

module.exports = new Database();