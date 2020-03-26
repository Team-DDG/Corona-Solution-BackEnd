import { Router, Request, Response, NextFunction } from "express";
import StatusService from "../../services/status";
import { ISidoStatus, IPatientStatus, IMedicalInstitutionStatus } from "../../interfaces/IStatus";
import { ILocationDTO } from "../../interfaces/ILocation";

const router: Router = Router();

export default (app: Router) => {
    app.use("/status", router);

    router.get("/sido", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const statusServiceInstance: StatusService = new StatusService();
            const sidoStatus : { baseDate: string, result: ISidoStatus[] } = await statusServiceInstance.getSidoStatus();

            return res.status(200).json(sidoStatus);
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

    router.get("/patient", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const statusServiceInstance: StatusService = new StatusService();
            const patientStatus: { baseDate: string, result: IPatientStatus } = await statusServiceInstance.getPatientStatus();

            return res.status(200).json(patientStatus);
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

    router.get("/clinic", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const locationDTO: ILocationDTO = req.query;
            const statusServiceInstance: StatusService = new StatusService();
            const clinicStatus: { result: IMedicalInstitutionStatus[] } = await statusServiceInstance.getClinicStatus(locationDTO);
    
            return res.status(200).json(clinicStatus);
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });

    router.get("/hospital", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const locationDTO: ILocationDTO = req.query;
            const statusServiceInstance: StatusService = new StatusService();
            const hospitalStatus: { result: IMedicalInstitutionStatus[] } = await statusServiceInstance.getHospitalStatus(locationDTO);
    
            return res.status(200).json(hospitalStatus);
        } catch (err) {
            console.error(err);
            return next(err);
        }
    });
};