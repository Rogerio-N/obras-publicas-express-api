import express from "express";
import client from "./src/config/database.js";
import bodyParser from 'body-parser';
import { userRouter } from "./src/routes/users.js";
import { readFile } from 'fs/promises';
import { themesRouter } from "./src/routes/themes.js";
import { complaintRouter } from "./src/routes/complaint.js";

import swaggerUi from 'swagger-ui-express'

const app = express();

const swaggerDocs = JSON.parse(
    await readFile(
        new URL("./src/swagger.json",import.meta.url)
    )
)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use("/users", userRouter);
app.use("/themes", themesRouter);
app.use("/complaints", complaintRouter);

const port = 3000 || process.env.PORT;

app.listen(port, () => {
    console.log("listening to port "+port)
})