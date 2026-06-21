import "./auth.js";

import { auth } from "./firebase.js";

import {
guardarHistorico,
carregarHistorico
} from "./historico.js";


console.log("🎵 PLAYSTAR ONLINE");


const resultado =
document.getElementById("resultado");


let historico = [];
let atual = -1;



// =============================
// PESQUISAR
// =============================

async function pesquisar(){


const texto =
document
.getElementById("searchInput")
.value.trim();



if(!texto) return;



resultado.innerHTML = `

<div class="card">
⏳ Procurando música...
</div>

`;



try {


const res = await fetch(
"/api/pesquisar?q="+
encodeURIComponent(texto)
);




// pega resposta segura

let data;


const content =
res.headers.get("content-type");



if(content && content.includes("application/json")){

data = await res.json();

}else{

const txt =
await res.text();

throw new Error(txt);

}





if(!res.ok){

throw new Error(
data.erro ||
data.message ||
"Erro na API"
);

}





const musicas =
data.resultados ||
data.data ||
[];




if(!musicas.length){

resultado.innerHTML = `

<div class="card">

❌ Nenhuma música encontrada

</div>

`;

return;

}





resultado.innerHTML="";





musicas.forEach(m=>{


const div =
document.createElement("div");


div.className="card";



div.innerHTML=`

🎵 <b>${m.titulo || m.title}</b>

<br>

🎤 ${m.artista || m.artist || "Desconhecido"}

<br><br>


<button>
▶️ Tocar
</button>


`;



div
.querySelector("button")
.onclick=()=>{


baixarMusica(m);


};



resultado.appendChild(div);



});



}catch(e){


console.log(e);



resultado.innerHTML=

`

<div class="card">

❌ Erro API:

<br><br>

${e.message}

</div>

`;

}



}





// =============================
// BAIXAR
// =============================


async function baixarMusica(m){


try{


resultado.innerHTML=

`

⏳ Baixando:

${m.titulo || m.title}

`;



const res =
await fetch(

"/api/baixar?url="+
encodeURIComponent(
m.url || m.link
)+
"&tipo=audio"

);





let data;


const type =
res.headers.get("content-type");



if(type?.includes("json")){


data =
await res.json();


}else{


throw new Error(
await res.text()
);


}





if(!res.ok || !data.sucesso){


throw new Error(
data.erro ||
"Falha no download"
);


}





const item={


nome:
data.title ||
m.titulo ||
m.title,


artista:
data.artist ||
m.artista ||
m.artist,


download:
data.download,


tipo:"audio",


data:
new Date()
.toLocaleString()


};





historico.push(item);


atual =
historico.length-1;




await guardarHistorico(item)
.catch(()=>{});



mostrarPlayer(item);




}catch(e){


resultado.innerHTML=

`

❌ Erro Download:

<br>

${e.message}

`;

}



}








// =============================
// PLAYER
// =============================


function mostrarPlayer(item){


document
.getElementById("nomeMusica")
.innerHTML =
item.nome;



document
.getElementById("nomeArtista")
.innerHTML =
"🎤 "+item.artista;




const audio =
document.getElementById("audioPlayer");


audio.src =
item.download;


audio.play()
.catch(()=>{});



}





function proximo(){


if(atual < historico.length-1){


atual++;


mostrarPlayer(
historico[atual]
);


}else{


alert(
"Fim da playlist"
);


}


}




function anterior(){


if(atual>0){


atual--;


mostrarPlayer(
historico[atual]
);


}else{


alert(
"Primeira música"
);


}


}






window.pesquisar =
pesquisar;


window.proximo =
proximo;


window.anterior =
anterior;








// =============================
// LOGIN
// =============================


auth.onAuthStateChanged(

async user=>{


if(user){


document
.getElementById("loginArea")
.style.display="none";



document
.getElementById("userArea")
.style.display="block";



document
.getElementById("usuario")
.innerHTML=

"👤 "+user.email;



historico =
await carregarHistorico();



}else{


document
.getElementById("loginArea")
.style.display="block";


document
.getElementById("userArea")
.style.display="none";


}


});
