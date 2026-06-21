const API = "https://api.cyberhost.online";
const KEY = "cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";

export default async function handler(req, res) {
  try {
    const url = req.query.url;
    const tipo = req.query.tipo || "audio";

    if (!url) {
      return res.json({
        sucesso: false,
        erro: "Sem link"
      });
    }

    let endpoint = "";
    let body = { url };

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
    }

    else if (url.includes("tiktok.com")) {
      endpoint = "/tiktok/download";
    }

    else if (url.includes("instagram.com")) {
      endpoint = "/instagram/download";
    }

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

    const data = await resposta.json();

    console.log(data);

    const link =
      data.file ||
      data.download ||
      data.url ||
      data.video ||
      data.audio;

    if (!link) {
      return res.json({
        sucesso: false,
        erro: "Sem arquivo",
        resposta: data
      });
    }

    return res.json({
      sucesso: true,
      download: link.startsWith("http")
        ? link
        : API + link,
      title: data.title || "",
      artist: data.artist || ""
    });

  } catch (e) {

    console.error(e);

    return res.status(500).json({
      sucesso: false,
      erro: e.message
    });
  }
}
