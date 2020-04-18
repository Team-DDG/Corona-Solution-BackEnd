import { expect } from "chai";
import StatusService from "../src/services/status";
import { ISidoStatus, IPatientStatus, IMedicalInstitutionStatus } from "../src/interfaces/IStatus";
import { createConnection } from "typeorm";

const statusServiceInstance: StatusService = new StatusService();

describe('/api/status', async () => {
    it('GET /sido', async () => {
        const sidoStatus: { baseDate: string, result: ISidoStatus[] } = await statusServiceInstance.getSidoStatus();
        
        expect(sidoStatus.baseDate).to.have.lengthOf.at.least(1);
        expect(sidoStatus.result).to.have.lengthOf(17);
    });

    it('GET /patient', async () => {
        const patientStatus: { baseDate: string, result: IPatientStatus } = await statusServiceInstance.getPatientStatus();
        
        expect(patientStatus.baseDate).to.have.lengthOf.at.least(1);
        for (const e in patientStatus.result) {
            expect(patientStatus.result[e].total).to.have.lengthOf.at.least(1);
            expect(patientStatus.result[e].before).to.have.lengthOf.at.least(1);
        }
    });

    it('typeorm connection', async () => {
        await createConnection();
    });

    it('GET /clinic', async () => {
        const clinicStatus: { result: IMedicalInstitutionStatus[] } = await statusServiceInstance.getClinicOrHospitalStatus({ lat: 37.56, lng: 126.98 }, "clinic");
        
        expect(clinicStatus.result[0]).to.have.keys("name", "address", "phone", "lat", "lng");
    });

    it('GET /hospital', async () => {
        const hospitalStatus: { result: IMedicalInstitutionStatus[] } = await statusServiceInstance.getClinicOrHospitalStatus({ lat: 37.56, lng: 126.98 }, "hospital");
    
        expect(hospitalStatus.result[0]).to.have.keys("name", "address", "phone", "lat", "lng");
    });
});