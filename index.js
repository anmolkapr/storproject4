require("dotenv").config(); 
import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";


//configs
import googleAuthConfig from "./config/google.config";

import Auth from "./API/Auth/index";

//DATABASE CONNECTION
import ConnectDB from "./database/connection";

const zomato = express();

//passport
googleAuthConfig(passport);
const session = require('express-session');
zomato.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla' 
  }));
zomato.use(express.json());
zomato.use(express.urlencoded({extended: false}));
zomato.use(cors());
zomato.use(helmet());
zomato.use(passport.initialize());
zomato.use(passport.session());



zomato.get("/", (req,res) =>{
    res.json({message : "Setup Success"});
})

zomato.use("/auth",Auth);//redirect to auth

zomato.listen(4000,() => ConnectDB()
       .then(() => console.log("Servr is up and running"))
       .catch(() => console.log("Server is running but DB connection failes"))
       );
//mongoose for schemas
// cors cross origin requests cle