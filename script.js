import "./auth.js";

import { auth } from "./firebase.js";

import {
guardarHistorico,
carregarHistorico
} from "./historico.js";


const resultado =
document.getElementById("resultado");


let lista = [];
let atual = -1;



// ================= DOWNLOAD =================


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

"/api/baixar?url="+
encodeURIComponent(url)+
"&tipo="+tipo

);



const texto =
await res.text();



console.log("RESPOSTA API:",texto);



if(!texto){

throw new Error(
"API sem resposta"
);

}



let data;


try{

data = JSON.parse(texto);

}

catch{

throw new Error(
"Resposta inválida da API"
);

}



if(!data.sucesso){

throw new Error(
data.erro || "Erro"
);

}




const item = {


nome:
data.title ||
data.titulo ||
"🎵 Música",


url:url,


download:data.download,


tipo:tipo,


data:
new Date().toLocaleString()


};




lista.push(item);


atual =
lista.length-1;



try{

await guardarHistorico(item);

}catch(e){

console.log(
"Histórico:",
e.message
);

}



mostrar(item);



}catch(e){


resultado.innerHTML = `

<div class="card">

❌ ${e.message}

</div>

`;

console.log(e);

}



}





// ================= PLAYER =================



function mostrar(item){


resultado.innerHTML = `

<div class="card">


<h2>${item.nome}</h2>


<p>${item.data || ""}</p>




${
item.tipo==="audio"


?

`

<audio controls autoplay style="width:100%">


<source src="${item.download}"
type="audio/mpeg">


</audio>

`


:

`

<video

controls

autoplay

playsinline

width="100%">


<source src="${item.download}"
type="video/mp4">


</video>


`

}




<br><br>



<button onclick="anterior()">

⏮️ Anterior

</button>



<button onclick="proximo()">

⏭️ Próximo

</button>




<br><br>



<a href="${item.download}" target="_blank">

⬇️ Abrir ficheiro

</a>



</div>

`;

}





// ================= PESQUISA =================



async function pesquisar(){


const nome =
document.getElementById("url").value.trim();



if(!nome){

alert("Digite o nome");

return;

}



resultado.innerHTML = `

<div class="card">

🔎 Pesquisando...

</div>

`;



try{


const res = await fetch(

"/api/pesquisar?q="+
encodeURIComponent(nome)

);



const data =
await res.json();



if(!data.sucesso){

throw new Error(data.erro);

}



resultado.innerHTML="";



data.resultados.forEach(video=>{


resultado.innerHTML += `

<div class="card">


<h3>${video.titulo}</h3>


<p>🎤 ${video.autor}</p>



<button onclick="baixarLink('${video.url}','audio')">

🎧 Áudio

</button>



<button onclick="baixarLink('${video.url}','video')">

🎬 Vídeo

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




function baixarLink(link,tipo){


document.getElementById("url").value =
link;


baixar(tipo);


}





// ================= NAVEGAÇÃO =================



function proximo(){


if(atual < lista.length-1){

atual++;

mostrar(lista[atual]);


}else{

alert("Não existe próximo");

}

}




function anterior(){


if(atual>0){

atual--;

mostrar(lista[atual]);


}else{

alert("É o primeiro");

}

}





// ================= WINDOW =================



window.baixarAudio =
()=>baixar("audio");


window.baixarVideo =
()=>baixar("video");


window.pesquisar =
pesquisar;


window.baixarLink =
baixarLink;


window.proximo =
proximo;


window.anterior =
anterior;





// ================= LOGIN =================



auth.onAuthStateChanged(

async user=>{


if(user){


document.getElementById("loginArea").style.display="none";


document.getElementById("userArea").style.display="block";



document.getElementById("usuario").innerHTML =

"👤 "+user.email;



lista =
await carregarHistorico();



}



});
