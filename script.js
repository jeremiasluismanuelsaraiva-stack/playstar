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



const texto = await res.text();



console.log("RESPOSTA API:", texto);



if(!texto){

throw new Error(
"API sem resposta"
);

}



let data;


try{

data = JSON.parse(texto);

}catch{

throw new Error(
"Resposta inválida da API"
);

}




if(!data.sucesso){

throw new Error(
data.erro
);

}




const item = {

nome:
data.title ||
"🎵 Música",

url:url,

download:data.download,

tipo:tipo,

data:
new Date().toLocaleString()

};




lista.push(item);


atual =
lista.length - 1;



await guardarHistorico(item);



mostrar(item);



}catch(e){


resultado.innerHTML = `

<div class="card">

❌ Erro:

${e.message}

</div>

`;

console.log(e);


}



}





function mostrar(item){


resultado.innerHTML = `

<div class="card">


<h2>${item.nome}</h2>


<p>${item.data}</p>



${
item.tipo==="audio"

?

`

<audio controls autoplay style="width:100%">

<source src="${item.download}">

</audio>

`

:

`

<video controls autoplay playsinline width="100%">

<source src="${item.download}">

</video>

`

}



<br><br>


<a href="${item.download}" target="_blank">

⬇️ Abrir ficheiro

</a>


</div>

`;

}




function pesquisar(){


const nome =
document.getElementById("url").value.trim();



if(!nome){

alert("Digite música");

return;

}


resultado.innerHTML = `

<div class="card">

🔎 Pesquisando ${nome}

</div>

`;



// por enquanto pesquisa usando YouTube

document.getElementById("url").value =
"https://www.youtube.com/results?search_query="
+
encodeURIComponent(nome);


}





function proximo(){


if(atual < lista.length-1){

atual++;

mostrar(lista[atual]);

}

}



function anterior(){


if(atual > 0){

atual--;

mostrar(lista[atual]);

}

}





window.baixarAudio =
()=>baixar("audio");


window.baixarVideo =
()=>baixar("video");


window.pesquisar =
pesquisar;


window.proximo =
proximo;


window.anterior =
anterior;





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
