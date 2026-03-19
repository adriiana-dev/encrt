const conexao = require("../config/conexao");
const { nanoid } = require("nanoid");
 
// Gera um código curto e salva no banco
async function criarUrlCurta(req, res) {
  const { urlOriginal } = req.body;
 
  if (!urlOriginal) {
    return res.status(400).json({ erro: "A URL original é obrigatória." });
  }
 
  // Valida se é uma URL válida
  try {
    new URL(urlOriginal);
  } catch {
    return res.status(400).json({ erro: "URL inválida. Certifique-se de incluir http:// ou https://" });
  }
 
  
  const jaExiste = await conexao.query(
    "SELECT * FROM urls WHERE url_original = $1",
    [urlOriginal]
  );
 
  if (jaExiste.rows.length > 0) {
    const urlExistente = jaExiste.rows[0];
    return res.status(200).json({
      mensagem: "Essa URL já foi encurtada anteriormente.",
      urlCurta: `${process.env.BASE_URL}/${urlExistente.codigo_curto}`,
      cliques: urlExistente.cliques,
    });
  }
 
  // Gera um código único de 7 caracteres
  const codigoCurto = nanoid(7);
 
  const resultado = await conexao.query(
    "INSERT INTO urls (url_original, codigo_curto) VALUES ($1, $2) RETURNING *",
    [urlOriginal, codigoCurto]
  );
 
  const urlCriada = resultado.rows[0];
 
  return res.status(201).json({
    mensagem: "URL encurtada com sucesso!",
    urlCurta: `${process.env.BASE_URL}/${urlCriada.codigo_curto}`,
    cliques: 0,
  });
}
 
async function redirecionarParaUrlOriginal(req, res) {
  const { codigoCurto } = req.params;
 
  const resultado = await conexao.query(
    "SELECT * FROM urls WHERE codigo_curto = $1",
    [codigoCurto]
  );
 
  if (resultado.rows.length === 0) {
    return res.status(404).json({ erro: "Link curto não encontrado." });
  }
 
  const url = resultado.rows[0];
 
  // Implementa o contador de cliques
  await conexao.query(
    "UPDATE urls SET cliques = cliques + 1 WHERE id = $1",
    [url.id]
  );
 
  return res.redirect(url.url_original);
}
 

async function listarTodasUrls(req, res) {
  const resultado = await conexao.query(
    "SELECT id, url_original, codigo_curto, cliques, data_criacao FROM urls ORDER BY data_criacao DESC"
  );
 
  return res.status(200).json(resultado.rows);
}
 

async function buscarEstatisticasDaUrl(req, res) {
  const { codigoCurto } = req.params;
 
  const resultado = await conexao.query(
    "SELECT id, url_original, codigo_curto, cliques, data_criacao FROM urls WHERE codigo_curto = $1",
    [codigoCurto]
  );
 
  if (resultado.rows.length === 0) {
    return res.status(404).json({ erro: "Link curto não encontrado." });
  }
 
  return res.status(200).json(resultado.rows[0]);
}
 
async function deletarUrl(req, res) {
  const { codigoCurto } = req.params;
 
  const resultado = await conexao.query(
    "DELETE FROM urls WHERE codigo_curto = $1 RETURNING *",
    [codigoCurto]
  );
 
  if (resultado.rows.length === 0) {
    return res.status(404).json({ erro: "Link curto não encontrado." });
  }
 
  return res.status(200).json({ mensagem: "URL deletada com sucesso." });
}
 
module.exports = {
  criarUrlCurta,
  redirecionarParaUrlOriginal,
  listarTodasUrls,
  buscarEstatisticasDaUrl,
  deletarUrl,
};