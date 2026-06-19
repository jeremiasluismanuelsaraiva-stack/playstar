const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Lista de músicas
const musicas = [
  { id: 1, titulo: "Música 1", arquivo: "musica1.mp3" },
  { id: 2, titulo: "Música 2", arquivo: "musica2.mp3" }
];

// Endpoint para listar músicas
app.get("/api/musicas", (req, res) => {
  res.json(musicas);
});

// Endpoint para servir arquivo de música
app.get("/api/musicas/:id", (req, res) => {
  const musica = musicas.find(m => m.id == req.params.id);
  if (!musica) return res.status(404).send("Não encontrada");
  res.sendFile(path.join(__dirname, "musicas", musica.arquivo));
});

// Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
