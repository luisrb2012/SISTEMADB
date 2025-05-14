import { Pool } from 'pg';

const pool = new Pool({
  user: 'suporteti',
  password: 'tomoson9#',
  host: '192.168.1.43',
  port: 5432,
  database: 'dbsistemas'
});

export default pool;