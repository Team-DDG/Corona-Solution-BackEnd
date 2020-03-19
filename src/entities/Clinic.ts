import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Clinic {

    @Column("varchar", { length: 100 })
    name: string;

    @PrimaryColumn("varchar", { length: 100 })
    address: string;

    @Column("varchar", { length: 100 })
    phone: string;

    @Column("decimal", { precision: 20, scale: 17 })
    lng: string;

    @Column("decimal", { precision: 20, scale: 18 })
    lat: string;
}