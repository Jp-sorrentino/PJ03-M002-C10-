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

var message = "";

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

  if (!nome) {
    res.render("new", {
      message: "Nome é obrigatório",
    });
  }

  else if (!imagem) {
    res.render("new", {
      message: "Imagem é obrigatório",
    });
  }

  else {
    try {
      const filme = await Filme.create({
        nome,
        descricao,
        imagem,
      });
      
      message = "Seu filme foi cadastrado!"


      res.redirect("/");

    } catch (err) {
      console.log(err);

      res.render("new", {
        message: "Ocorreu um erro ao cadastrar o Filme!",
      });
    }
  }
});

app.get("/edit/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);

  if (!filme) {
    res.render("edit", {
      message: "Filme não encontrado!",
    });
  }

  res.render("edit", {
    filme,
  });
});

app.post("/edit/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);

  const { nome, descricao, imagem } = req.body;

  filme.nome = nome;
  filme.descricao = descricao;
  filme.imagem = imagem;

  const filmeEditado = await filme.save();

  res.render("edit", {
    filme: filmeEditado,
    message: "Filme editado com sucesso!",
  });
});


app.get("/delete/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);

  if (!filme) {
    res.render("delete", {
      message: "Filme não encontrado!",
    });
  }

  res.render("delete", {
    filme,
  });
});

app.post("/delete/:id", async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);

  if (!filme) {
    res.render("delete", {
      message: "Filme não encontrado!",
    });
  }

  await filme.destroy();

  message = `Filme ${filme.nome} deletado com sucesso!`,

  res.redirect("/");
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));