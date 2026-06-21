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



// ===========================
// DOWNLOAD PLAYSTAR
// ===========================

async function baixar(tipo){


const url =
document.getElementById("url")
.value.trim();



if(!url){

alert("Cole um link");

return;

}



resultado.innerHTML = `

<div class="card">

⏳ Preparando sua música...

</div>

`;



try{


const resposta =
await fetch(

`/api/baixar?url=${encodeURIComponent(url)}&tipo=${tipo}`

);



const data =
await resposta.json();



if(!data.sucesso){

throw new Error(
data.erro ||
"Erro ao baixar"
);

}




const item={


nome:
data.title ||
"🎵 Música sem nome",


artista:
data.artist ||
"PlayStar",


download:
data.download,


tipo,


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


resultado.innerHTML=`

<div class="card">

❌ ${e.message}

</div>

`;

}


}





// ===========================
// PLAYER
// ===========================


function mostrarPlayer(item){



resultado.innerHTML=`

<div class="card">


<h2>
🎵 ${item.nome}
</h2>


<h3>
🎤 ${item.artista}
</h3>


${

item.tipo==="audio"


?

`

<audio id="player"
controls
autoplay
>

<source 
src="${item.download}"
type="audio/mpeg">

</audio>

`


:


`

<video
controls
autoplay
width="100%"
>

<source 
src="${item.download}"
type="video/mp4">

</video>

`

}



<div class="controls">


<button onclick="anterior()">

⏮️

</button>



<button onclick="proximo()">

⏭️

</button>



<button>

❤️

</button>



</div>



</div>

`;



}







// ===========================
// PLAYLIST
// ===========================


function proximo(){


if(
atual < historico.length-1
){


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





// ===========================
// PESQUISA
// ===========================


async function pesquisar(){


const texto =
document
.getElementById("searchInput")
.value;



const res =
await fetch(
"/api/pesquisar?q="+
encodeURIComponent(texto)
);



const musicas =
await res.json();



resultado.innerHTML="";



musicas.forEach((m)=>{


resultado.innerHTML += `


<div class="music">


🎵 ${m.nome}

<br>

🎤 ${m.artista}


<button onclick="baixar('audio')">

▶️

</button>



</div>


`;


});


}








// ===========================
// BOTÕES HTML
// ===========================


window.baixarAudio =
()=>baixar("audio");



window.baixarVideo =
()=>baixar("video");



window.proximo =
proximo;



window.anterior =
anterior;



window.pesquisar =
pesquisar;









// ===========================
// FIREBASE LOGIN
// ===========================


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
