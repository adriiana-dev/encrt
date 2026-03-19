Cria o banco de dados (rode este comando separadamente no psql se necessário)
-- CREATE DATABASE encrt;
 
-- Remove a tabela se já existir 
DROP TABLE IF EXISTS urls;
 
-- Cria a tabela principal
CREATE TABLE urls (
  id            SERIAL PRIMARY KEY,
  url_original  TEXT        NOT NULL,
  codigo_curto  VARCHAR(10) NOT NULL UNIQUE,
  cliques       INTEGER     NOT NULL DEFAULT 0,
  data_criacao  TIMESTAMP   NOT NULL DEFAULT NOW()
);
 
-- para tornar a busca pelo código curto mais rápida
-- toda vez que alguém acessa um link, o banco busca por este campo
CREATE INDEX idx_codigo_curto ON urls (codigo_curto);
 
-- Para evitar duplicações e agilizar a busca por URL original
CREATE INDEX idx_url_original ON urls (url_original);
 