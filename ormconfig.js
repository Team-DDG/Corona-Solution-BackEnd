require("dotenv").config();

const { PASSWORD } = process.env;

module.exports = {
    type: "mysql",
    host: "janghoseung.cohmubv7xzz8.ap-northeast-2.rds.amazonaws.com",
    port: 3306,
    username: "root",
    password: PASSWORD,
    database: "corona",
    synchronize: true,
    entities: ["src/entities/*.ts"]
}