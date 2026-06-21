import "./auth.js";

import { auth } from "./firebase.js";

import {
  guardarHistorico,
  carregarHistorico
} from "./historico.js";

const resultado =
  document.getElementById("resultado");

const listaHistorico =
  document.getElementById("listaHistorico");

let lista = [];
let atual = -1;

// =======================
// DOWNLOAD
// =======================

async function baixar(tipo){

  const url =
    document.getElementById("url").value.trim();

  if(!url){
    alert("Cole um link");
    return;
  }

  resultado.innerHTML = `
    <div class="card">
      ⏳ Processando...
    </div>
  `;

  try{

    const res = await fetch(
      "/api/baixar?url=" +
      encodeURIComponent(url) +
      "&tipo=" + tipo
    );

    const texto =
      await res.text();

    console.log(texto);

    const data =
      JSON.parse(texto);

    if(!data.sucesso){
      throw new Error(
        data.erro || "Erro"
      );
    }

    const item = {
      nome:
        data.title ||
        "🎵 Música",

      artista:
        data.artist ||
        "Desconhecido",

      url,

      download:
        data.download,

      tipo,

      data:
        new Date()
        .toLocaleString()
    };

    lista.push(item);

    atual =
      lista.length - 1;

    try{
      await guardarHistorico(item);
    }catch(e){
      console.log(e);
    }

    atualizarHistorico();

    mostrarPlayer(item);

  }catch(e){

    resultado.innerHTML = `
      <div class="card">
        ❌ ${e.message}
      </div>
    `;

  }

}

// =======================
// BAIXAR DA PESQUISA
// =======================

async function baixarMusica(m){

  const tipo =
    confirm(
      "OK = MP3\nCancelar = MP4"
    )
    ? "audio"
    : "video";

  resultado.innerHTML = `
    <div class="card">
      ⏳ Baixando ${m.titulo}
    </div>
  `;

  try{

    const res =
      await fetch(
        "/api/baixar?url=" +
        encodeURIComponent(m.url) +
        "&tipo=" + tipo
      );

    const texto =
      await res.text();

    const data =
      JSON.parse(texto);

    if(!data.sucesso){
      throw new Error(data.erro);
    }

    const item = {
      nome:
        data.title ||
        m.titulo,

      artista:
        data.artist ||
        m.artista,

      download:
        data.download,

      tipo,

      data:
        new Date()
        .toLocaleString()
    };

    lista.push(item);

    atual =
      lista.length - 1;

    try{
      await guardarHistorico(item);
    }catch{}

    atualizarHistorico();

    mostrarPlayer(item);

  }catch(e){

    resultado.innerHTML = `
      <div class="card">
        ❌ ${e.message}
      </div>
    `;

  }

}

// =======================
// PLAYER
// =======================

function mostrarPlayer(item){

  resultado.innerHTML = `
    <div class="card">

      <h2>${item.nome}</h2>

      <p>🎤 ${item.artista}</p>

      <p>${item.data}</p>

      ${
        item.tipo === "audio"
        ?
        `
        <audio
          controls
          autoplay
          style="width:100%">
          <source
            src="${item.download}">
        </audio>
        `
        :
        `
        <video
          controls
          autoplay
          width="100%">
          <source
            src="${item.download}">
        </video>
        `
      }

      <br><br>

      <button onclick="anterior()">
        ⏮️
      </button>

      <button onclick="proximo()">
        ⏭️
      </button>

      <br><br>

      <a
        href="${item.download}"
        target="_blank">

        ⬇️ Abrir

      </a>

    </div>
  `;

}

// =======================
// PESQUISA
// =======================

async function pesquisar(){

  const texto =
    document.getElementById("url")
    .value.trim();

  if(!texto){
    alert("Digite algo");
    return;
  }

  resultado.innerHTML = `
    <div class="card">
      🔎 Pesquisando...
    </div>
  `;

  try{

    const res =
      await fetch(
        "/api/pesquisar?q=" +
        encodeURIComponent(texto)
      );

    const data =
      await res.json();

    if(!data.sucesso){
      throw new Error(data.erro);
    }

    resultado.innerHTML = "";

    data.resultados.forEach(m => {

      resultado.innerHTML += `
        <div class="card">

          <h3>
            ${m.titulo}
          </h3>

          <p>
            🎤 ${m.artista}
          </p>

          <button
          onclick='baixarMusica(${JSON.stringify(m)})'>
          🎵 Baixar
          </button>

        </div>
      `;

    });

  }catch(e){

    resultado.innerHTML = `
      <div class="card">
        ❌ ${e.message}
      </div>
    `;

  }

}

// =======================
// HISTÓRICO
// =======================

function atualizarHistorico(){

  if(!listaHistorico)
    return;

  listaHistorico.innerHTML = "";

  lista.forEach((m,index)=>{

    listaHistorico.innerHTML += `
      <div
      class="item-historico"
      onclick="abrirHistorico(${index})">

        🎵 ${m.nome}

      </div>
    `;

  });

}

function abrirHistorico(i){

  atual = i;

  mostrarPlayer(
    lista[i]
  );

}

// =======================
// NAVEGAÇÃO
// =======================

function proximo(){

  if(
    atual <
    lista.length - 1
  ){

    atual++;

    mostrarPlayer(
      lista[atual]
    );

  }

}

function anterior(){

  if(atual > 0){

    atual--;

    mostrarPlayer(
      lista[atual]
    );

  }

}

// =======================
// BOTÕES
// =======================

window.baixarAudio =
  () => baixar("audio");

window.baixarVideo =
  () => baixar("video");

window.pesquisar =
  pesquisar;

window.baixarMusica =
  baixarMusica;

window.proximo =
  proximo;

window.anterior =
  anterior;

window.abrirHistorico =
  abrirHistorico;

// =======================
// FIREBASE LOGIN
// =======================

auth.onAuthStateChanged(
async user => {

  if(user){

    document.getElementById(
      "loginArea"
    ).style.display = "none";

    document.getElementById(
      "userArea"
    ).style.display = "block";

    document.getElementById(
      "usuario"
    ).innerHTML =
      "👤 " + user.email;

    lista =
      await carregarHistorico();

    atualizarHistorico();

  }

});
