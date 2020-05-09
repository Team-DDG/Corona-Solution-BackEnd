import { expect } from "chai";
import { Container } from "typedi";
import { createConnection } from "typeorm";
import StatusService from "../src/services/status";
import { sidoResponse, patientResponse, hospitalResponse } from "../src/types/response";

const statusServiceInstance: StatusService = Container.get(StatusService);

describe('/api/status', async () => {
    it('GET /sido', async () => {
        const sidoStatus: sidoResponse = await statusServiceInstance.getSidoStatus();
        
        expect(sidoStatus.baseDate).to.have.lengthOf.at.least(1);
        expect(sidoStatus.result).to.have.lengthOf(18);
    });

    it('GET /patient', async () => {
        const patientStatus: patientResponse = await statusServiceInstance.getPatientStatus();
        
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
        const clinicStatus: hospitalResponse = await statusServiceInstance.getHospitalStatus({ lat: 37.56, lng: 126.98 }, "clinic");
        
        expect(clinicStatus.result[0]).to.have.all.keys("name", "address", "phone", "lat", "lng");
    });

    it('GET /hospital', async () => {
        const hospitalStatus: hospitalResponse = await statusServiceInstance.getHospitalStatus({ lat: 37.56, lng: 126.98 }, "hospital");
    
        expect(hospitalStatus.result[0]).to.have.all.keys("name", "address", "phone", "lat", "lng");
    });
});