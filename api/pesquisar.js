// =============================
// PLAYSTAR PESQUISA
// api/pesquisar.js
// =============================


module.exports = async (req,res)=>{


res.setHeader(
"Content-Type",
"application/json"
);



try{


const q =
req.query.q;



if(!q){

return res.json({
sucesso:true,
resultados:[]
});

}



const url =
"https://api.cyberhost.online/youtube/search?q="
+
encodeURIComponent(q);



const resposta =
await fetch(
url,
{
headers:{
"x-api-key":
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a"
}
}
);



const texto =
await resposta.text();



console.log(
"PESQUISA:",
texto
);



let data;



try{

data =
JSON.parse(texto);

}catch(e){


return res.status(500).json({

sucesso:false,

erro:
"API retornou texto inválido",

resposta:texto.substring(0,200)

});


}





const lista =

data.results ||
data.data ||
data.items ||
[];





const resultados = lista.map(m=>({


titulo:
m.title ||
m.name ||
"Sem nome",



artista:
m.artist ||
m.author ||
"Desconhecido",



url:
m.url ||
m.link ||
m.video_url ||
m.webpage_url ||
"",



imagem:
m.thumbnail ||
m.image ||
""


}));




return res.json({

sucesso:true,

resultados

});





}catch(e){


console.log(
"ERRO PLAYSTAR:",
e
);



return res.status(500).json({

sucesso:false,

erro:e.message

});


}


};
