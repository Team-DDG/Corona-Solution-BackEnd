import { Application, Request, Response, NextFunction } from "express";
import routes from "../api";

export default ({ app }: { app: Application }) => {
    app.use("/api", routes());
    
    app.use((req: Request, res: Response, next: NextFunction) => {
        const err: Error = new Error("Not Found");

        err["status"] = 404;
        next(err);
    });

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.sendStatus(err.status ?? 500);
    });
};