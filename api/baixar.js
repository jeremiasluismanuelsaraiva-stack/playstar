// PLAYSTAR PESQUISA MUSICA

const API =
"https://api.cyberhost.online";

const KEY =
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";


export default async function handler(req,res){


try{


const q =
req.query.q;


if(!q){

return res.json({
sucesso:false,
erro:"Digite uma música"
});

}



const resposta =
await fetch(
API+"/youtube/search",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

api_key:KEY,

q:q,

limit:10

})

});



const data =
await resposta.json();



const musicas =
data.results ||
data.data ||
[];



res.json({

sucesso:true,

resultados:
musicas.map(m=>({


titulo:
m.title ||
m.name,


artista:
m.artist ||
m.author ||
"Desconhecido",


url:
m.url ||
m.link,


capa:
m.thumbnail ||
m.image


}))

});



}catch(e){


res.json({

sucesso:false,

erro:e.message

});


}


}
