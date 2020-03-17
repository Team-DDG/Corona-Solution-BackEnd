export interface IStatus {
    total: string;
    before: string;
};

export interface ISidoStatus {
    sido: string;
    confirmed: string;
    dead: string;
};

export interface IPatientStatus {
    baseDate: string;
    confirmed: IStatus;
    cured: IStatus;
    curing: IStatus
    dead: IStatus;
};