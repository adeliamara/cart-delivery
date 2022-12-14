import { Pool } from "pg";

const connectionString = `postgres://credencial:credencial@localhost:5432/nomebd`;

const db = new Pool({connectionString});

export default db;