async function baixarMusica(m){


const tipo =
confirm("OK = MP3 Áudio\nCancelar = MP4 Vídeo")
?
"audio"
:
"video";



resultado.innerHTML = `

<div class="card">

⏳ Baixando ${m.titulo}

</div>

`;



try{


const res =
await fetch(

"/api/baixar?url="+
encodeURIComponent(m.url)+
"&tipo="+tipo

);



const resposta =
await res.text();



console.log(
"BAIXAR:",
resposta
);



const data =
JSON.parse(resposta);




if(!data.sucesso){

throw new Error(
data.erro
);

}




const item = {


nome:
data.title ||
m.titulo,



artista:
data.artist ||
m.artista,



download:
data.download,



tipo:
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


resultado.innerHTML = `

<div class="card">

❌ ${e.message}

</div>

`;

}


}
