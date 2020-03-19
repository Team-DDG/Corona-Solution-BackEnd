export interface IPersonStatus {
    total: string;
    before: string;
}

export interface ISidoStatus {
    sido: string;
    confirmed: string;
    dead: string;
}

export interface IPatientStatus {
    confirmed: IPersonStatus;
    cured: IPersonStatus;
    curing: IPersonStatus
    dead: IPersonStatus;
}

export interface IMedicalInstitutionStatus {
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
}