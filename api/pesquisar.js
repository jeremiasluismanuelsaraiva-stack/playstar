// =============================
// PLAYSTAR PESQUISAR MÚSICAS
// api/pesquisar.js
// =============================

const https = require("https");


const API =
"https://api.cyberhost.online";


const KEY =
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";



function requestAPI(endpoint){


return new Promise((resolve,reject)=>{


https.get(

endpoint,

{
headers:{
"x-api-key":KEY
}
},

res=>{


let data="";


res.on(
"data",
c=>data+=c
);



res.on(
"end",
()=>{


try{

resolve(
JSON.parse(data)
);


}catch(e){

reject(
new Error(data)
);

}


}


);


}


).on(
"error",
reject
);



});


}







module.exports = async(req,res)=>{


res.setHeader(
"Content-Type",
"application/json"
);



try{


const q =
req.query.q;



if(!q){


return res.json({

resultados:[]

});


}





const api =

await requestAPI(

`${API}/youtube/search?q=${encodeURIComponent(q)}`

);





const lista =

api.results ||
api.data ||
api.items ||
[];





const resultados =

lista.map(x=>({


titulo:

x.title ||
x.name ||
"Sem título",



artista:

x.artist ||
x.author ||
"Desconhecido",



url:

x.url ||
x.link ||
x.video_url ||
"",



imagem:

x.thumbnail ||
x.image ||
""


}));






res.json({

sucesso:true,

resultados

});






}catch(e){


console.log(
"ERRO PESQUISA:",
e.message
);



res.status(500).json({

sucesso:false,

erro:e.message

});

}



};
