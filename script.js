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



async function baixar(tipo){


const url =
document.getElementById("url").value.trim();



if(!url){

alert("Cole link");

return;

}



resultado.innerHTML = `

<div class="card">

⏳ Processando...

</div>

`;



try{


const controller = new AbortController();


const tempo = setTimeout(()=>{

controller.abort();

},60000);



const res = await fetch(

"/api/baixar?url="+
encodeURIComponent(url)+
"&tipo="+tipo,

{

signal:controller.signal

}

);



console.log(
"STATUS API:",
res.status
);



const texto =
await res.text();



console.log(
"RESPOSTA API:",
texto
);



if(!texto){

throw new Error(
"API não respondeu"
);

}



let data;



try{


data = JSON.parse(texto);


}catch(e){


throw new Error(
"Resposta inválida: "+texto
);


}



if(!data.sucesso){


throw new Error(
data.erro || "Erro desconhecido"
);


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





lista.push(item);


atual =
lista.length-1;




try{

await guardarHistorico(item);

}catch(e){

console.log(
"Erro ao guardar histórico:",
e.message
);

}




mostrar(item);



clearTimeout(tempo);



}catch(e){


clearTimeout(tempo);



if(e.name==="AbortError"){


resultado.innerHTML = `

<div class="card">

❌ Tempo excedido

A API demorou muito

</div>

`;


}else{


resultado.innerHTML = `

<div class="card">

❌ ${e.message}

</div>

`;

}



}



}







function mostrar(item){



resultado.innerHTML = `

<div class="card">


<h2>

${item.nome}

</h2>



<p>

${item.data || ""}

</p>




${
item.tipo==="audio"


?


`

<audio 
controls 
autoplay
style="width:100%">


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

playsinline

width="100%">


<source

src="${item.download}"

type="video/mp4">


</video>


`

}





<br><br>



<a

href="${item.download}"

target="_blank">


⬇️ Abrir ficheiro


</a>



</div>

`;

}





window.baixarAudio =
()=>baixar("audio");



window.baixarVideo =
()=>baixar("video");






window.proximo = ()=>{


if(atual < lista.length-1){


atual++;


mostrar(lista[atual]);


}else{


alert(
"Não existe próximo"
);


}


};






window.anterior = ()=>{


if(atual > 0){


atual--;


mostrar(lista[atual]);


}else{


alert(
"É o primeiro"
);


}


};








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



}



});
