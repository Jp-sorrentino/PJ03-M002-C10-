require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Const para armanezar a porta do servidor
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());

// Fazendo a conexão com o banco e recebendo o modelo do Sequelize
const Filme = require("./models/filme");

const message = "";

app.get("/", async (req, res) => {
  const filmes = await Filme.findAll();
  res.render("index", {
    filmes, message
  });
});

app.get("/details/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);
  res.render("details", {
    filme,
  });
});

app.get("/new", (req, res) => {
  res.render("new", {
    message
  });
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

// app.post("/criar", async (req, res) => {
//   const { nome, descricao, imagem } = req.body;

//   if (!nome) {
//     res.render("criar", {
//       message: "Nome é obrigatório",
//     });
//   }

//   else if (!imagem) {
//     res.render("criar", {
//       message: "Imagem é obrigatório",
//     });
//   }

//   else {
//     try {
//       const filme = await Filme.create({
//         nome,
//         descricao,
//         imagem,
//       });

//       res.render("criar", {
//         filme, message: "Seu filme foi cadastrado!"
//       });
//     } catch (err) {
//       console.log(err);

//       res.render("criar", {
//         message: "Ocorreu um erro ao cadastrar o Filme!",
//       });
//     }
//   }
// });

app.get("/edit/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);
  res.render("edit", {
    filme,
  });
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));