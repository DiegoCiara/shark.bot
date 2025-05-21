import { SocketEmitController } from "./app/sockets/SessionEmmiter";
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
require('dotenv').config();

// const SOCKET_CONNECTION = `${process.env.CLIENT_CONNECTION}`;

const SOCKET_CONNECTION = '*';

app.use(
  cors({
      origin: SOCKET_CONNECTION,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      optionsSuccessStatus: 204,
  })
);

const socket = http.createServer(app);

const io = new Server(socket, {
    cors: {
        origin: SOCKET_CONNECTION,
        credentials: true,
    }, 
});

const ioSocket = SocketEmitController(io)


export { socket, io, ioSocket };