import { Router } from "express";
import status from "./routes/status";

export default () => {
    const app: Router = Router();
    status(app);

    return app;
};