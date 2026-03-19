const express = require("express");
const roteador = express.Router();
 
const {
  criarUrlCurta,
  listarTodasUrls,
  buscarEstatisticasDaUrl,
  deletarUrl,
} = require("../controllers/urlController");
 
// POST /api/urls cria uma nova URL curta
roteador.post("/", criarUrlCurta);
 
// GET /api/urls  lista todas as URLs e seus cliques
roteador.get("/", listarTodasUrls);
 
// GET /api/urls/:codigoCurto retorna estatísticas de uma URL específica
roteador.get("/:codigoCurto", buscarEstatisticasDaUrl);
 
// DELETE /api/urls/:codigoCurto deleta uma URL
roteador.delete("/:codigoCurto", deletarUrl);
 
module.exports = roteador;
 