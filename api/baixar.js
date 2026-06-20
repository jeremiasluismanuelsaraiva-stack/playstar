import "./auth.js";

import { auth } from "./firebase.js";

import {
guardarHistorico,
carregarHistorico
} from "./historico.js";


console.log("SCRIPT CARREGADO");


const resultado =
document.getElementById("resultado");


let historico = [];
let atual = -1;



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


const resposta = await fetch(

"/api/baixar?url="+
encodeURIComponent(url)+
"&tipo="+tipo

);



const texto =
await resposta.text();



console.log("API:",texto);



let data;


try{

data = JSON.parse(texto);

}catch{

throw new Error(texto);

}



if(!data.sucesso){

throw new Error(data.erro);

}




const item={


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




historico.push(item);


atual =
historico.length-1;



// guardar Firebase

try{

await guardarHistorico(item);

}catch(e){

console.log(
"Erro histórico:",
e.message
);

}



mostrarPlayer(item);



}catch(e){


resultado.innerHTML = `

<div class="card">

❌ ${e.message}

</div>

`;

}


}






function mostrarPlayer(item){


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

<video controls autoplay playsinline width="100%">

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






function proximo(){


if(atual < historico.length-1){

atual++;

mostrarPlayer(
historico[atual]
);

}else{

alert("Não existe próximo");

}

}





function anterior(){


if(atual>0){

atual--;

mostrarPlayer(
historico[atual]
);

}else{

alert("É o primeiro");

}

}





// botões HTML

window.baixarAudio =
()=>baixar("audio");


window.baixarVideo =
()=>baixar("video");


window.proximo =
proximo;


window.anterior =
anterior;







// LOGIN FIREBASE


auth.onAuthStateChanged(

async user=>{


if(user){


document.getElementById(
"loginArea"
).style.display="none";



document.getElementById(
"userArea"
).style.display="block";



document.getElementById(
"usuario"
).innerHTML =

"👤 "+user.email;



historico =
await carregarHistorico();



console.log(
"Histórico carregado",
historico
);



}else{


document.getElementById(
"loginArea"
).style.display="block";


document.getElementById(
"userArea"
).style.display="none";


}



});
