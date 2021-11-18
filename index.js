require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Const para armanezar a porta do servidor
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());

const message = "";


const Filme = require("./models/filme");
app.get("/", async (req, res) => {
  const filmes = await Filme.findAll();
  res.render("index", {
    filmes, message
  });
});

const Filmes = require("./models/filme");
app.get("/details/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);
  res.render("details", {
    filme,
  });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/new", async (req, res) => {
  const { nome, descricao, imagem } = req.body;
  
  const filme = await Filme.create({
    nome,
    descricao,
    imagem,
  });
  res.redirect("/");
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`))