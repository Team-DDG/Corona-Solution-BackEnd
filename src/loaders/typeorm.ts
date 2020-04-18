import "reflect-metadata";
import { createConnection } from "typeorm";

export default async () => {
    await createConnection();
};