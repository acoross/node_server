const assert = require('assert');

var express = require('express');
var bodyParser = require('body-parser');
var login = require('./login');
var protocol_client = require('./protocol_client');
var protocol_server = require('./protocol_server');

var mysql_test = require('./mysql_test');

function validate_schema(protocol, obj) {
    return Object.keys(protocol).every((prop) => {
        return obj.hasOwnProperty(prop);
    });
}

var app = express();
app.use(bodyParser.json());

app.post('/login.php', (req, res) => {
    if (!validate_schema(protocol_client.login_request, req.body)) {
        return res.json({
            "name": "error",
            "message": "invalid packet body" + JSON.stringify(req.body)
        });
    }

    login.process_login(Number(req.body.account_id), req.body.password)
        .then(
            (login_response) => {
                assert(validate_schema(protocol_server.login_response, login_response),
                    "response protocol is weired");
                res.json(login_response);
            },
            (err) => {
                if (err.name == "login_failure")
                    res.json(err);
                else
                    throw err;
            });
});

app.post('/hello', (req, res) => {
    res.json({
        name: "json",
        message: "hello, express"
    });
});

app.post('/db', (req, res) => {
    mysql_test.test(function(err) {
        if (err) {
            return res.json({ name: "fail", message: err.message });
        }

        return res.json({
            name: "json",
            message: "done"
        });
    });
});

app.post('/promise', (req, res) => {
    // var p = new Promise((resolve, reject)=>{
    //     throw new Error('in promise');
    // }).then(
    //     ()=>{},
    //     (err)=>{
    //         res.json(err);
    //     }
    // );

    // var propagate = new Promise((resolve, reject)=>{
    //     throw new Error('in promise');
    // }).then(
    //     ()=>{}
    // ).then(
    //     ()=>{}
    // ).catch(
    //     (err)=>{
    //         res.send(err.message);
    //     }
    // );

    var p1 = new Promise((resolve) => {
        throw new Error("p1");
        //resolve("p1");
    }).catch((err) => {
        console.log("err: " + err.message);
        throw err;
    });
    var p2 = new Promise((resolve) => {
        //resolve("p2");
        throw new Error("p2");
    }).catch((err) => {
        console.log("err: " + err.message);
    });

    var multiple = Promise.all([p1, p2]);
    multiple.then((name) => {
            console.log("then " + name);
        })
        // .catch((err)=>{
        //     res.send(err.message);
        // });
});

app.listen(8082);