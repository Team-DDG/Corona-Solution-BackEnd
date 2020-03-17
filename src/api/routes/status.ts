import { Router, Request, Response, NextFunction } from "express";
import StatusService from "../../services/status";
import { ISidoStatus, IPatientStatus } from "../../interfaces/IStatus";

const router: Router = Router();

export default (app: Router) => {
    app.use('/status', router);

    router.get('/sido', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const statusServiceInstance: StatusService = new StatusService();
            const sidoStatus : { baseDate: string, status: ISidoStatus[] } = await statusServiceInstance.getSidoStatus();
            return res.status(200).json(sidoStatus);
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

    router.get('/patient', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const statusServiceInstance: StatusService = new StatusService();
            const patientStatus: IPatientStatus = await statusServiceInstance.getPatientStatus();
            return res.status(200).json(patientStatus);
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });
};