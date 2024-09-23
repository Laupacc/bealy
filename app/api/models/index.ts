import { Sequelize } from "sequelize";
import config from "../config/config";

interface DBConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: any;
}

const dbConfig: DBConfig = config.development;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

export default sequelize;
