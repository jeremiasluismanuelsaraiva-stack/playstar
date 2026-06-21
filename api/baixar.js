const API = "https://api.cyberhost.online";
const KEY = "cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    const { url, tipo = "audio" } = req.query;

    if (!url) {
      return res.json({
        sucesso: false,
        erro: "Sem link"
      });
    }

    let endpoint = "";
    let body = { url };

    // YouTube
    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be")
    ) {
      endpoint = "/youtube/download";

      body.type =
        tipo === "video"
          ? "video"
          : "audio";

      body.format =
        tipo === "video"
          ? "mp4"
          : "mp3";

      body.quality = "720";
    }

    // TikTok
    else if (url.includes("tiktok.com")) {
      endpoint = "/tiktok/download";
    }

    // Instagram
    else if (url.includes("instagram.com")) {
      endpoint = "/instagram/download";
    }

    // Facebook
    else if (
      url.includes("facebook.com") ||
      url.includes("fb.watch")
    ) {
      endpoint = "/facebook/download";
    }

    else {
      return res.json({
        sucesso: false,
        erro: "Link não suportado"
      });
    }

    console.log("API:", API + endpoint);
    console.log("BODY:", body);

    const resposta = await fetch(
      API + endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          api_key: KEY,
          ...body
        })
      }
    );

    const texto = await resposta.text();

    console.log("CYBERHOST:", texto);

    let data;

    try {
      data = JSON.parse(texto);
    } catch {
      return res.json({
        sucesso: false,
        erro: "Resposta inválida da API",
        resposta: texto
      });
    }

    const link =
      data.file ||
      data.download ||
      data.url ||
      data.video ||
      data.audio ||
      data.result;

    if (!link) {
      return res.json({
        sucesso: false,
        erro: "Sem arquivo retornado",
        resposta: data
      });
    }

    return res.json({
      sucesso: true,
      download: link.startsWith("http")
        ? link
        : API + link,
      title:
        data.title ||
        data.titulo ||
        "Sem título",
      artist:
        data.artist ||
        data.autor ||
        ""
    });

  } catch (e) {
    console.error("ERRO:", e);

    return res.status(500).json({
      sucesso: false,
      erro: e.message
    });
  }
}
