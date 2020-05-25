import "reflect-metadata";
import Container from "typedi";
import { useContainer, createConnection } from "typeorm";

export default async () => {
    useContainer(Container);
    await createConnection();
};