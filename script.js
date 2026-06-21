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





// =====================
// PESQUISAR MÚSICA
// =====================

async function pesquisar(){


const texto =
document
.getElementById("searchInput")
.value.trim();



if(!texto){

return;

}



resultado.innerHTML = `

<div class="card">

⏳ Procurando...

</div>

`;





try{


const res =
await fetch(
"/api/pesquisar?q="+
encodeURIComponent(texto)
);



const data =
await res.json();



const musicas =
data.resultados ||
[];





resultado.innerHTML="";





musicas.forEach(m=>{


const div =
document.createElement("div");


div.className="card";



div.innerHTML = `

🎵 <b>${m.titulo}</b>

<br>

🎤 ${m.artista}

<br><br>

<button>

▶️ Tocar

</button>

`;





div.querySelector("button")
.onclick=()=>{


baixarMusica(m);


};



resultado.appendChild(div);



});



}catch(e){


resultado.innerHTML=

`
<div class="card">

❌ ${e.message}

</div>
`;

}


}








// =====================
// BAIXAR
// =====================


async function baixarMusica(m){



resultado.innerHTML = `

⏳ Baixando ${m.titulo}

`;





const res =
await fetch(

"/api/baixar?url="+
encodeURIComponent(m.url)+
"&tipo=audio"

);



const data =
await res.json();




if(!data.sucesso){

alert(data.erro);

return;

}




const item={


nome:
data.title ||
m.titulo,


artista:
data.artist ||
m.artista,


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



}









// =====================
// PLAYER
// =====================


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
document
.getElementById("audioPlayer");



audio.src =
item.download;


audio.play();




}





// =====================
// NAVEGAÇÃO
// =====================


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


window.tocarAtual =
()=>{};








// =====================
// FIREBASE LOGIN
// =====================


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
