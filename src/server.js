require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
 
const urlRotas = require("./routes/urlRotas");
const { redirecionarParaUrlOriginal } = require("./controllers/urlController");
 
const servidor = express();
const PORTA = process.env.PORTA || 3000;
 
// Middlewares
servidor.use(cors());
servidor.use(express.json());
servidor.use(express.static(path.join(__dirname, "../public")));
 
// Rotas da API
servidor.use("/api/urls", urlRotas);
 
// Rota de redirecionamento — deve ficar depois das rotas da API
// Ex: acessar http://localhost:3000/abc1234 redireciona para a URL original
servidor.get("/:codigoCurto", redirecionarParaUrlOriginal);
 
servidor.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
 