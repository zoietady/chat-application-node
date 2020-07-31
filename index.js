if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const Message = require('./models/message');

mongoose.connect(`mongodb+srv://admin:${process.env.DB_PASSWORD}@chat.9rqhw.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`,{ useUnifiedTopology: true , useNewUrlParser: true  }, (err) => {
    console.log('mongodb connection', err);
})

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/messages', (req,res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages);
    })
});

app.post('/messages', (req,res) => {
    let message = new Message(req.body);

    message.save((err) => {
        if(err) sendStatus(500);

        io.emit('message', req.body);
        res.sendStatus(200);
    })
});

io.on('connection', (socket) => {
    console.log('a user has connected');
});

var server = http.listen(process.env.PORT || 5000, () => {
    console.log(`server is now listening on port`, server.address().port);
});