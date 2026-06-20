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



console.log("API:",texto);



const data =
JSON.parse(texto);



if(!data.sucesso){

throw new Error(data.erro);

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



await guardarHistorico(item);



mostrarHistorico();



mostrar(item);




}catch(e){



resultado.innerHTML = `

<div class="card">

❌ ${e.message}

</div>

`;

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



const texto =
document.getElementById("url").value.trim();



if(!texto){

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
encodeURIComponent(texto)

);



const data =
await res.json();



if(!data.sucesso){

throw new Error(data.erro);

}




resultado.innerHTML = "";





data.resultados.forEach(video=>{


resultado.innerHTML += `

<div class="card">


<h3>${video.titulo}</h3>


<p>

🎤 ${video.autor}

</p>



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









// ================= HISTÓRICO =================



function mostrarHistorico(){



const area =
document.getElementById("listaHistorico");



if(!area) return;



if(lista.length===0){


area.innerHTML =
"🎵 Nenhuma música ainda";


return;


}



area.innerHTML = "";





lista.forEach((item,index)=>{


area.innerHTML += `

<div class="card">


<b>${item.nome}</b>


<br>

${item.data || ""}


<br><br>


<button onclick="tocarHistorico(${index})">

▶️ Abrir

</button>



</div>

`;



});



}







function tocarHistorico(index){


atual=index;


mostrar(lista[index]);


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



window.tocarHistorico =
tocarHistorico;









// ================= AUTH =================



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





lista =
await carregarHistorico();





mostrarHistorico();





}else{



document.getElementById(
"loginArea"
).style.display="block";



document.getElementById(
"userArea"
).style.display="none";


}



});
