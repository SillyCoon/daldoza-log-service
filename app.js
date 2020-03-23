const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');

const urlencodedParser = bodyParser.json();
const app = express();

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
        return ` Player ${logItem.player} ${logItem.type} ${logItem.actionCoordinate}\n`;
    }
});

app.post("/log/roll", urlencodedParser, (req, res) => {
    logHandler(req, res, prettyLogRoll);

    function prettyLogRoll(logItem) {
        return ` Player ${logItem.player} ${logItem.type} and get dices ${logItem.dices.join()}\n`;
    }
});

function logHandler(req, res, prettyLog) {
    const logItem = req.body;
    const logString = prettyLog(logItem);

    fs.writeFile('./log/all-logs.txt', logString, { flag: 'a' }, () => {
        res.send(logItem.type);
    });
}


app.listen(3000);

