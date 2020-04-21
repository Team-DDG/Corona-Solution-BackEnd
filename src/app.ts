import "reflect-metadata";
import loader from "./loaders";
import { Application } from "express";
import * as express from "express";
import * as dotenv from "dotenv";
dotenv.config();

function startServer() {
    const app: Application = express();
    
    loader({ app });

    app.listen(process.env.PORT);
}

startServer();