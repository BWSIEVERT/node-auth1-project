const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');

// to persist session to db so they don't die on server reloads
const KnexSessionStore = require('connect-session-knex')(session)

const usersRouter = require("./user/router");
const authRouter = require('./auth/auth-router')

const server = express();


const config = {
  name: "sessionId", 
  secret: "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,

  // to persist session to db so they don't die on server reloads
  store: new KnexSessionStore({
    knex: require("../database/dbConfig"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(session(config))
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use('/api/auth', authRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;