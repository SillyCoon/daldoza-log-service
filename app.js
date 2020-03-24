const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
var cors = require('cors')

const urlencodedParser = bodyParser.json();
const app = express();

app.use(cors())

app.get("/health", (req, res) => {
    res.status(200).send('health check: OK');
});

app.post("/log/move", urlencodedParser, (req, res) => {
    logHandler(req, res, prettyLogMove);

    function prettyLogMove(logItem) {
        const move = ` Player ${logItem.player} ${logItem.type} ${logItem.params.from} -> ${logItem.params.to}`;
        const eat = logItem.params.eat ? " and eat\n" : "\n";
        return move + eat;
    }
});

app.post("/log/activate", urlencodedParser, (req, res) => {
    logHandler(req, res, prettyLogActivate)

    function prettyLogActivate(logItem) {
        return ` Player ${logItem.player} ${logItem.type} ${logItem.params.actionCoordinate}\n`;
    }
});


app.post("/log/roll", urlencodedParser, (req, res) => {
    logHandler(req, res, prettyLogRoll);

    function prettyLogRoll(logItem) {
        return ` Player ${logItem.player} ${logItem.type} and get dices ${logItem.params.dices.join()}\n`;
    }
});

function logHandler(req, res, prettyLog) {
    const logItem = req.body;
    const logString = prettyLog(logItem);
    console.log(logItem);
    fs.writeFile('./logs/all-logs.txt', logString, { flag: 'a' }, () => {
        res.send(logItem.type);
    });
}


app.listen(3000, () => {
    console.log('listen port: ' + 3000);
});

