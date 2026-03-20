const { Pool } = require("pg");
require("dotenv").config();

let config;

if (process.env.DATABASE_URL) {
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false 
    }
  };
} else {
  
  config = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORTA || 5432,
    database: process.env.DB_NOME,
    user: process.env.DB_USUARIO,
    password: process.env.DB_SENHA,
    ssl: false 
  };
}

const conexao = new Pool(config);

conexao.query("SELECT 1")
  .then(() => {
    console.log("✅ Conectado ao PostgreSQL com sucesso!");
  })
  .catch((erro) => {
    console.error("❌ Erro ao conectar no banco de dados:", erro.message);
  });

module.exports = conexao;