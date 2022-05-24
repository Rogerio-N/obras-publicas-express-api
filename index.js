import express from "express";
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import client from "./src/config/database.js";
import bodyParser from 'body-parser';
import { userRouter } from "./src/routes/users.js";
import { readFile } from 'fs/promises';
import { themesRouter } from "./src/routes/themes.js";
import { complaintRouter } from "./src/routes/complaint.js";
import cors from 'cors'

import swaggerUi from 'swagger-ui-express'

const app = express();

Sentry.init({
    dsn: "https://c3dcdf4f679341d69de33fbfdb423261@o1150780.ingest.sentry.io/6224241",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],
    //This value can be alter. 1.0 means 100%
    tracesSampleRate: 1.0, 
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

const swaggerDocs = JSON.parse(
    await readFile(
        new URL("./src/swagger.json",import.meta.url)
    )
)

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use("/users", userRouter);
app.use("/themes", themesRouter);
app.use("/complaints", complaintRouter);

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

const port = process.env.PORT || 3000;

app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
    console.log("listening to port "+port)
})