const config = {
  development: {
    username: "root",
    password: "!pass",
    database: "BEALY_TT_DB",
    host: "BEALYSQL",
    dialect: "mysql",
  },
};

const databaseName = config.development.database;
console.log(databaseName);

export default config;
