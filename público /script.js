import "./auth.js";


import {
auth
} from "./firebase.js";


import {
guardarHistorico,
carregarHistorico
} from "./historico.js";



const resultado =
document.getElementById("resultado");


let lista=[];

let atual=-1;



async function baixar(tipo){


const url =
document.getElementById("url").value.trim();



if(!url){

alert("Cole link");

return;

}



resultado.innerHTML =
"⏳ Processando...";



try{


const res =
await fetch(

"/api/baixar?url="+
encodeURIComponent(url)+
"&tipo="+tipo

);



const data =
await res.json();



if(!data.sucesso){

throw new Error(data.erro);

}



let item={

nome:"Vídeo",

url:url,

download:data.download,

tipo:tipo

};



lista.push(item);


atual=lista.length-1;



await guardarHistorico(item);



mostrar(item);



}catch(e){


resultado.innerHTML =
"❌ "+e.message;


}


}



function mostrar(item){


resultado.innerHTML=`


<div class="card">


<h2>🎵 ${item.nome}</h2>



${
item.tipo==="audio"

?

`<audio controls autoplay src="${item.download}"></audio>`

:

`<video controls autoplay src="${item.download}"></video>`

}



<br>


<button onclick="anterior()">
⏮️
</button>


<button onclick="proximo()">
⏭️
</button>



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

}




window.anterior=()=>{


if(atual>0){

atual--;

mostrar(lista[atual]);

}

}





auth.onAuthStateChanged(async user=>{


if(user){


document.getElementById("loginArea").style.display="none";


document.getElementById("userArea").style.display="block";


document.getElementById("usuario").innerHTML=
"👤 "+user.email;



lista =
await carregarHistorico();


}


});
