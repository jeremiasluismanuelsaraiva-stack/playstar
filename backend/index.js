// Imports
const express = require("express");
const { google } = require("googleapis");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

// Configurações das APIs
const YOUTUBE_API_KEY = "SUA_CHAVE_GOOGLE"; // substitua pelo AIzaSy...
const API_CYBERHOST = "https://api.cyberhost.online";
const API_KEY_CYBERHOST = "SUA_CHAVE_CYBERHOST"; // substitua pelo cyber_...

// Função para buscar músicas no YouTube (Google API)
async function buscarMusica(nome) {
  const youtube = google.youtube("v3");
  const res = await youtube.search.list({
    key: YOUTUBE_API_KEY,
    part: "snippet",
    q: nome,
    maxResults: 3
  });
  return res.data.items.map(item => ({
    titulo: item.snippet.title,
    canal: item.snippet.channelTitle,
    url: `https://youtube.com/watch?v=${item.id.videoId}`
  }));
}

// Função para baixar áudio/vídeo (CyberHost API)
async function baixarYoutube(url, tipo = "audio") {
  const res = await fetch(`${API_CYBERHOST}/youtube/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: API_KEY_CYBERHOST,
      url,
      type: tipo,
      format: tipo === "audio" ? "mp3" : "mp4",
      quality: tipo === "video" ? "720" : undefined
    })
  });

  const data = await res.json();
  if (!data.file) throw new Error("Erro ao baixar via CyberHost");
  return `${API_CYBERHOST}/youtube${data.file}`;
}

// Rotas
app.get("/buscar", async (req, res) => {
  try {
    const { q } = req.query;
    const resultados = await buscarMusica(q);
    res.json(resultados);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

app.get("/baixar", async (req, res) => {
  try {
    const { url, tipo } = req.query;
    const link = await baixarYoutube(url, tipo || "audio");
    res.json({ download: link });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
