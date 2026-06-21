// =============================
// PLAYSTAR PESQUISA DE MÚSICAS
// api/pesquisar.js
// =============================

const https = require("https");


const API =
"https://api.cyberhost.online";


const KEY =
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";



function chamarAPI(q){

return new Promise((resolve,reject)=>{


const body =
JSON.stringify({

api_key: KEY,

q: q

});



const req =
https.request(

API + "/youtube/search",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"Content-Length":
Buffer.byteLength(body)

}

},


(res)=>{


let texto="";



res.on(
"data",
chunk=>{
texto+=chunk;
}
);



res.on(
"end",
()=>{


try{

resolve(
JSON.parse(texto)
);


}catch(e){

reject(
new Error(texto)
);

}


});


}


);



req.on(
"error",
reject
);



req.write(body);

req.end();



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





const data =
await chamarAPI(q);





const lista =
data.results ||
data.data ||
data.items ||
[];






const resultados =
lista.map(item=>({


titulo:
item.title ||
item.name ||
"Sem título",



artista:
item.artist ||
item.channel ||
"Desconhecido",



url:
item.url ||
item.link ||
item.webpage_url ||
""



}));






res.json({

resultados

});





}catch(e){


console.log(
"ERRO PESQUISA:",
e.message
);



res.status(500).json({

erro:
e.message

});


}



};
