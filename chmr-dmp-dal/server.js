import express from 'express';
import { Pool } from 'pg';

const app = express();
const pgHost = process.env.POSTGRES_HOST;
const port = process.env.PORT_DMP_DAL;

var pool = new Pool({
    user: 'postgres',
    host: pgHost
});

// body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/ingest/single', async(req, res) => {
    await pool.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), age INT)')
    res.send('Success!')
});

app.listen(port);
console.log('chmr-dmp-dal Running on port: ${port}');