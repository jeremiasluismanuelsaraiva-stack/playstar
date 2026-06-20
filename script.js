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



clearTimeout(tempo);



const texto =
await res.text();



console.log("RESPOSTA API:",texto);



let data;


try{

data = JSON.parse(texto);

}

catch{

throw new Error(texto);

}




if(!data.sucesso){

throw new Error(data.erro);

}




const item={


nome:"🎵 Música",

url:url,

download:data.download,

tipo:tipo,

data:new Date().toLocaleString()


};




lista.push(item);


atual =
lista.length-1;




await guardarHistorico(item);



mostrar(item);



}catch(e){


if(e.name==="AbortError"){


resultado.innerHTML = `

<div class="card">

❌ Tempo excedido

API demorou muito

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


<h2>${item.nome}</h2>


<p>${item.data || ""}</p>



${
item.tipo==="audio"

?

`

<audio controls autoplay>

<source src="${item.download}">

</audio>

`

:

`

<video controls autoplay width="100%">

<source src="${item.download}">

</video>

`

}



<br><br>


<a href="${item.download}" target="_blank">

⬇️ Abrir

</a>


</div>

`;

}





window.baixarAudio=()=>baixar("audio");

window.baixarVideo=()=>baixar("video");




window.proximo=()=>{


if(atual < lista.length-1){

atual++;

mostrar(lista[atual]);

}

};



window.anterior=()=>{


if(atual>0){

atual--;

mostrar(lista[atual]);

}

};





auth.onAuthStateChanged(async user=>{


if(user){


document.getElementById("loginArea").style.display="none";


document.getElementById("userArea").style.display="block";



document.getElementById("usuario").innerHTML =

"👤 "+user.email;



lista = await carregarHistorico();



}


});
