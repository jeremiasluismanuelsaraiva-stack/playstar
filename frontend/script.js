async function buscarMusica() {
  const nome = document.getElementById("busca").value;
  const res = await fetch(`/buscar?q=${encodeURIComponent(nome)}`);
  const lista = await res.json();

  const ul = document.getElementById("resultados");
  ul.innerHTML = "";

  lista.forEach(m => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${m.titulo}</strong><br>
      Canal: ${m.canal}<br>
      <a href="${m.url}" target="_blank">▶ Assistir no YouTube</a>
      <div class="controls">
        <button onclick="baixar('${m.url}','audio')">🎧 Escutar</button>
        <button onclick="baixar('${m.url}','video')">📹 Baixar Vídeo</button>
      </div>
      <div id="player-${m.url}"></div>
    `;
    ul.appendChild(li);
  });
}

async function baixar(url, tipo) {
  const res = await fetch(`/baixar?url=${encodeURIComponent(url)}&tipo=${tipo}`);
  const data = await res.json();

  const playerDiv = document.getElementById(`player-${url}`);
  playerDiv.innerHTML = "";

  if (tipo === "audio") {
    playerDiv.innerHTML = `
      <audio controls>
        <source src="${data.download}" type="audio/mpeg">
        Seu navegador não suporta áudio.
      </audio>
    `;
  } else {
    playerDiv.innerHTML = `
      <video controls>
        <source src="${data.download}" type="video/mp4">
        Seu navegador não suporta vídeo.
      </video>
    `;
  }
}
