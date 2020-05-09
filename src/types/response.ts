import { ISidoStatus, IPatientStatus, IHospitalStatus } from "../interfaces/IStatus";

export type sidoResponse = { baseDate: string, result: ISidoStatus[] };
export type patientResponse = { baseDate: string, result: IPatientStatus };
export type hospitalResponse = { result: IHospitalStatus[] };