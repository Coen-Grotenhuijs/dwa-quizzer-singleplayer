const express = require('express');

const mongoose = require('mongoose');
const questionModel = require('./models/question');

const cors = require('cors');
const bodyParser = require('body-parser');

const quiz = require('./routes/quizRoute');
const team = require('./routes/teamRoute');
const question = require('./routes/questionRoute');
const fs = require('fs');

const http = require('http');
const ws = require('ws');
const app = express();
const port = 8000;
const server = http.createServer(app);
const wsServer = new ws.Server({
    server: server
});

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use('/quiz', quiz);
app.use('/team', team);
app.use('/question', question);

mongoose.connect('mongodb://localhost/quizzer-single',{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).catch(err => console.log('Something went wrong', err));

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error: "));
db.once("open", () => {console.log("Connection successfully")});

//load questions
try {
    const data = fs.readFileSync('questions.json', 'utf8');
    const questions = JSON.parse(data);
    questionModel.create(questions);
} catch (err) {
    console.error(err)
}

wsServer.on('connection', (socket) => {
    console.log("Websocket connection created!");

    socket.on('message', (message) => {
        console.log("Incoming message: " + message);
        const msg =  JSON.parse(message);

        switch(msg.type) {
            case 'TEAM_JOINED':
                wsServer.clients.forEach((client) =>{
                    client.send(JSON.stringify({type: msg.type}))
                });
                break;
            case 'TEAM_ACCEPTED':
            case 'TEAM_DENIED':
                wsServer.clients.forEach((client) => {
                    client.send(JSON.stringify({type: msg.type}))
                });
                break;
            case 'START_QUIZ':
                wsServer.clients.forEach((client) => {
                    client.send(JSON.stringify({type: msg.type}))
                });
                break;
            case 'START_QUESTION':
                wsServer.clients.forEach((client) => {
                    client.send(JSON.stringify({type: msg.type}))
                });
                break;
            case 'CLOSE_QUESTION':
                wsServer.clients.forEach((client) => {
                    client.send(JSON.stringify({type: msg.type}))
                });
                break;
            case 'SEND_ANSWER':
                wsServer.clients.forEach((client) => {
                    client.send(JSON.stringify({type: msg.type}))
                });
                break;
            case 'CORRECT_ANSWER':
                wsServer.clients.forEach((client) => {
                    client.send(JSON.stringify({type: msg.type}))
                });
                break;
        }
    })
});

server.listen(port, () => console.log(`Server running at port: ${port}`));