const express = require("express");
const router = express.Router();
module.exports = router;
const modeloTarefa = require("../models/tarefa");

router.post("/post", verificaJWT, async (req, res) => {
  const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada,
  });
  try {
    const tarefaSalva = await objetoTarefa.save();
    res.status(200).json(tarefaSalva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getAll", verificaJWT, async (req, res) => {
  try {
    const resultados = await modeloTarefa.find();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", verificaJWT, async (req, res) => {
  try {
    const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/update/:id", verificaJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const novaTarefa = req.body;
    const options = { new: true };
    const result = await modeloTarefa.findByIdAndUpdate(
      id,
      novaTarefa,
      options
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get(
  "/encontraPorParteDaDescricao/:parteDaDescricao",
  verificaJWT, async (req, res) => {
    try {
      const resultados = await modeloTarefa.find({
        descricao: { $regex: req.params.parteDaDescricao, $options: "i" },
      });
      res.json(resultados);
    } catch (error) {
      res.status(500).json({ message: error.message });
      er.get("/getAllDone", async (req, res) => {
        try {
          const resultados = await modeloTarefa.find({ statusRealizada: true });
          res.json(resultados);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });

      router.get("/getAllUndone", verificaJWT, async (req, res) => {
        try {
          const resultados = await modeloTarefa.find({ statusRealizada: false });
          res.json(resultados);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
    }
  }
);

router.delete("/removeAll", verificaJWT, async (req, res) => {
  try {
    const resultado = await modeloTarefa.deleteMany();
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Autenticacao
var jwt = require('jsonwebtoken');
var userModel = require('../models/user')

router.post('/login', async (req, res, next) => {
  try {
    const data = await userModel.findOne({ 'nome': req.body.nome });

    if (data != null && data.senha === req.body.senha) {
      const token = jwt.sign({ id: req.body.user }, 'segredo', { expiresIn: 300 });
      return res.json({ token: token, admin: data.admin });
    }

    res.status(500).json({ message: 'Login invalido!' });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/user', verificaJWT, async (req, res) => {
  try {
    const data = await userModel.find();
    res.json(data);
  } catch(error) {
    res.status(500).json({message: error.message})
  }
})

router.delete("/user/:id", verificaJWT, async (req, res) => {
  try {
    const resultado = await userModel.findByIdAndDelete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/user/:id", verificaJWT, async (req, res) => {
  try {
    const { params: { id }, body: usuario } = req;
    const result = await userModel.findByIdAndUpdate(id, usuario, { new:true });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user", verificaJWT, async (req, res) => {
  const usuario = new userModel({ nome: req.body.nome, senha: req.body.senha });
  try {
    const usuarioSalvo = await usuario.save();
    res.status(200).json(usuarioSalvo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

function verificaJWT(req, res, next) {
  const token = req.headers['id-token'];
  if (!token) return res.status(401).json({
    auth: false, message: 'Token nao fornecido'
  });

  jwt.verify(token, 'segredo', function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Falha !' });
    next();
  });
}
