// api/pesquisar.js

const API = "https://api.cyberhost.online";
const KEY = "cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";


export default async function handler(req,res){

try{

const q = req.query.q;

if(!q){
return res.json({
resultados:[]
});
}


// LINK DIRETO

if(
q.includes("youtube.com") ||
q.includes("youtu.be") ||
q.includes("tiktok.com") ||
q.includes("facebook.com") ||
q.includes("instagram.com")
){

return res.json({
resultados:[
{
titulo:"Link encontrado",
artista:"PLAYSTAR",
url:q
}
]
});

}



// PESQUISA

const r = await fetch(
API +
"/youtube/search?q=" +
encodeURIComponent(q),
{
headers:{
"api_key": KEY
}
});


const texto = await r.text();


console.log("CYBER:",texto);


let data;

try{
data = JSON.parse(texto);
}catch{
return res.json({
erro:"Resposta não JSON",
resposta:texto
});
}



const lista =
data.results ||
data.data ||
data.result ||
[];



return res.json({

resultados:

lista.map(x=>({

titulo:
x.title ||
x.titulo ||
"Sem título",


artista:
x.author ||
x.artist ||
"Desconhecido",


url:
x.url ||
x.link ||
x.video_url ||
x.webpage_url


}))


});



}catch(e){

console.log(e);

return res.status(500).json({
erro:e.message
});

}

}
