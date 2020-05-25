import { expect } from "chai";
import { Container } from "typedi";
import { useContainer, createConnection } from "typeorm";
import StatusService from "../src/services/status";

describe('/api/status', async () => {
    before(async () => {
        useContainer(Container);
        await createConnection();
    });

    it('GET /sido', async () => {
        const statusServiceInstance: StatusService = Container.get(StatusService);
        const sidoStatus: Service.SidoResponse = await statusServiceInstance.getSidoStatus();
        
        expect(sidoStatus.baseDate).to.have.lengthOf.at.least(1);
        expect(sidoStatus.result).to.have.lengthOf(18);
    });

    it('GET /patient', async () => {
        const statusServiceInstance: StatusService = Container.get(StatusService);
        const patientStatus: Service.PatientResponse = await statusServiceInstance.getPatientStatus();
        
        expect(patientStatus.baseDate).to.have.lengthOf.at.least(1);
        for (const e in patientStatus.result) {
            expect(patientStatus.result[e].total).to.have.lengthOf.at.least(1);
            expect(patientStatus.result[e].before).to.have.lengthOf.at.least(1);
        }
    });

    it('GET /clinic', async () => {
        const statusServiceInstance: StatusService = Container.get(StatusService);
        const clinicStatus: Service.HospitalResponse = await statusServiceInstance.getHospitalStatus({ lat: 37.56, lng: 126.98 }, "clinic");
        
        expect(clinicStatus.result[0]).to.have.all.keys("name", "address", "phone", "lat", "lng");
    });

    it('GET /hospital', async () => {
        const statusServiceInstance: StatusService = Container.get(StatusService);
        const hospitalStatus: Service.HospitalResponse = await statusServiceInstance.getHospitalStatus({ lat: 37.56, lng: 126.98 }, "hospital");
    
        expect(hospitalStatus.result[0]).to.have.all.keys("name", "address", "phone", "lat", "lng");
    });
});