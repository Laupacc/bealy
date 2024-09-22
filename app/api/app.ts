
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import sequelize from './models';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const createDatabase = async (): Promise<void> => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'BEALYSQL',
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '!pass',
        });

        const dbName = process.env.DB_NAME || 'BEALY_TT_DB';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' created or already exists.`);
    } catch (error) {
        console.error('Error creating database:', error);
    }
};

createDatabase().then(() => {
    app.use(express.json());
    app.get('/', (request: Request, response: Response) => {
        return response.status(200).send({message:"API is reachable"});
    });





    // =============================================================================
    // =============================================================================




    sequelize.sync().then(() => {
        app.listen(8080, () => {
            console.log('Server is running on port 8080');
        });
    }).catch((err:any) => {
        console.error('Error syncing Sequelize models:', err);
    });
}).catch((err) => {
    console.error('Error during database creation:', err);
});

export default app;

