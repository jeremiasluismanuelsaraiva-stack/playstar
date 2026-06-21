// =============================
// PLAYSTAR PESQUISA
// api/pesquisar.js
// =============================


const https = require("https");


const API =
"https://api.cyberhost.online";


const KEY =
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";



function cyber(q){

return new Promise((resolve,reject)=>{


const url =
API+
"/youtube/search?q="+
encodeURIComponent(q);



https.get(
url,
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

reject(e);

}


});


}


).on(
"error",
reject
);



});

}






module.exports =
async(req,res)=>{


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



const data =
await cyber(q);




const lista =
data.results ||
data.data ||
[];




const resultados =
lista.map(m=>({


titulo:
m.title ||
m.name ||
"Sem título",


artista:
m.artist ||
m.author ||
"Desconhecido",


url:
m.url ||
m.link ||
""


}));




res.json({

resultados

});




}catch(e){


console.log(e);


res.status(500).json({

erro:e.message

});


}



};
