const { Pool } = require("pg");
require("dotenv").config();

const conexao = new Pool(
  process.env.PGHOST
    ? {
        host:     process.env.PGHOST,
        port:     process.env.PGPORT,
        database: process.env.PGDATABASE,
        user:     process.env.PGUSER,
        password: process.env.PGPASSWORD,
        ssl:      { rejectUnauthorized: false }
      }
    : {
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORTA,
        database: process.env.DB_NOME,
        user:     process.env.DB_USUARIO,
        password: process.env.DB_SENHA,
      }
);

conexao.query("SELECT 1").then(() => {
  console.log("Conectado ao PostgreSQL com sucesso!");
}).catch((erro) => {
  console.error("Erro ao conectar no banco de dados:", erro.message);
  process.exit(1);
});

module.exports = conexao;