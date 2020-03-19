import "reflect-metadata";
import { createConnection } from "typeorm";
import { Clinic } from "../entities/Clinic";
import { Hospital } from "../entities/Hospital";

export default async () => {
    await createConnection();
};