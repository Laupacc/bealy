import express, { Request, Response } from "express";
import mysql from "mysql2/promise";
import sequelize from "./models";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import usersRouter from "./routes/users";
import favouritesRouter from "./routes/favorites";
import hackernewsRouter from "./routes/hackernews";
import "./models/associations";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:4000", "http://localhost:3000"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["Authorization"],
  })
);

app.use("/users", usersRouter);
app.use("/favorites", favouritesRouter);
app.use("/hackernews", hackernewsRouter);

// Function to create the database
const createDatabase = async (): Promise<void> => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "BEALYSQL",
      user: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "!pass",
    });

    const dbName = process.env.DB_NAME || "BEALY_TT_DB";
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' created or already exists.`);
    await connection.end(); // Close the connection
  } catch (error) {
    console.error("Error creating database:", error);
    throw error;
  }
};

// Function to start the server
const startServer = async (): Promise<void> => {
  try {
    await sequelize.sync();
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  } catch (error) {
    console.error("Error syncing Sequelize models:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Main function to run the application
const main = async (): Promise<void> => {
  try {
    await createDatabase(); // Ensure the database is created
    app.use(express.json());

    app.get("/", (request: Request, response: Response) => {
      return response.status(200).send({ message: "API is reachable" });
    });

    await startServer(); // Start the server after the database has been created
  } catch (error) {
    console.error("Error during application startup:", error);
  }
};

// Execute the main function
main();

export default app;
