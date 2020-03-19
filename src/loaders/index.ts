import expressLoader from "./express";
import typeormLoader from "./typeorm";

export default async ({ app }) => {
    typeormLoader();
    expressLoader({ app });
};