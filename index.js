import express from "express";
import client from "./src/config/database.js";
import bodyParser from 'body-parser';
import { userRouter } from "./src/routes/users.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/users", userRouter);

const port = 3000 || process.env.PORT;

app.listen(port)