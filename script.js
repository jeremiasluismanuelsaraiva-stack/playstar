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

alert("Cole link");

return;

}



resultado.innerHTML = `

<div class="card">

⏳ Processando...

</div>

`;




try{


const controller =
new AbortController();



const tempo =
setTimeout(()=>{

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



console.log(
"RESPOSTA API:",
texto
);




let data;



try{

data =
JSON.parse(texto);

}

catch{

throw new Error(texto);

}





if(!data.sucesso){

throw new Error(data.erro);

}





const item = {


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



}

catch(e){



if(e.name==="AbortError"){


resultado.innerHTML = `

<div class="card">

❌ Tempo excedido

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







// ================= PLAYER =================



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

⬇️ Abrir ficheiro

</a>



</div>


`;



}







window.baixarAudio =
()=>baixar("audio");



window.baixarVideo =
()=>baixar("video");







// ================= NEXT =================



window.proximo = ()=>{


if(atual < lista.length-1){


atual++;


mostrar(lista[atual]);


}


};





window.anterior = ()=>{


if(atual > 0){


atual--;


mostrar(lista[atual]);


}


};









// ================= MENU =================




function esconder(){


document.getElementById("inicio").style.display="none";


document.getElementById("historico").style.display="none";


document.getElementById("config").style.display="none";


}






window.inicio = ()=>{


esconder();


document.getElementById("inicio").style.display="block";


};








window.mostrarHistorico = ()=>{


esconder();



document.getElementById("historico").style.display="block";



let box =
document.getElementById("listaHistorico");




if(lista.length===0){


box.innerHTML = `

<div class="card">

📭 Nenhum histórico

</div>

`;

return;


}




box.innerHTML = lista.map((x,i)=>`


<div class="card">


<h3>

${x.nome}

</h3>


<p>

${x.data}

</p>



<button onclick="tocarHistorico(${i})">

▶️ Reproduzir

</button>



</div>


`).join("");



};







window.tocarHistorico=(i)=>{


atual=i;


mostrar(lista[i]);


inicio();


};









window.configuracoes=()=>{


esconder();


document.getElementById("config").style.display="block";


};









window.sair=()=>{


auth.signOut();


location.reload();


};








// ================= LOGIN =================




auth.onAuthStateChanged(async user=>{


if(user){



document.getElementById("loginArea")
.style.display="none";



document.getElementById("userArea")
.style.display="block";




document.getElementById("usuario")
.innerHTML =


"👤 "+user.email;





lista =
await carregarHistorico();




}



});
