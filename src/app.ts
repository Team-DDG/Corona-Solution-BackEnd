import * as express from "express";
import { Application } from "express";
import loader from "./loaders";
import * as dotenv from "dotenv";
dotenv.config();

async function startServer() {
    const app: Application = express();
    
    loader({ app });

    app.listen(process.env.PORT);
}

startServer();