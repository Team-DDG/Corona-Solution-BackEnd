import { ISidoStatus, IPatientStatus, IHospitalStatus } from "../../interfaces/IStatus";
import { EntityManager } from "typeorm";

declare global {
    namespace Service {
        export type SidoResponse = { baseDate: string, result: ISidoStatus[] };
        export type PatientResponse = { baseDate: string, result: IPatientStatus };
        export type HospitalResponse = { result: IHospitalStatus[] };
    }

    namespace Typeorm {
        export type Manager = EntityManager;
    }
}