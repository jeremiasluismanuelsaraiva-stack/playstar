export default async function handler(req, res) {

try {

const q = req.query.q;

if (!q) {
return res.status(400).json({
erro:"Falta pesquisa"
});
}


// se for link usa direto
let url = null;

if (
q.includes("youtube.com") ||
q.includes("youtu.be")
){
url = q;
}


// ======================
// LINK YOUTUBE
// ======================

if(url){

return res.json({
resultados:[
{
titulo:"YouTube",
artista:"Vídeo encontrado",
url:url
}
]
});

}



// ======================
// PESQUISA POR NOME
// ======================


const api =
`https://api.cyberhost.online/youtube/search?q=${encodeURIComponent(q)}`;


const response =
await fetch(api,{
headers:{
"x-api-key":"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a"
}
});



const data =
await response.json();



const resultados =
data.results ||
data.data ||
[];





res.json({

resultados:
resultados.map(x=>({

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
x.link

}))

});



}catch(e){


console.log(e);


res.status(500).json({

erro:e.message

});


}

}
