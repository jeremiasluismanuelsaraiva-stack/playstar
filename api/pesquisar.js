const https = require("https");

const API_CYBERHOST =
"https://api.cyberhost.online";

const API_KEY =
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";


function postCyber(body){

return new Promise((resolve,reject)=>{


const data = JSON.stringify({

api_key:API_KEY,

...body

});



const req = https.request(

API_CYBERHOST + "/youtube/search",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"Content-Length":
Buffer.byteLength(data)

}

},


res=>{


let result="";


res.on(
"data",
c=>result+=c
);


res.on(
"end",
()=>{


try{

resolve(JSON.parse(result));

}

catch(e){

reject(new Error(result));

}


});


}



);



req.on(
"error",
reject
);



req.write(data);

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

sucesso:false,

erro:"Sem pesquisa"

});

}





const data =
await postCyber({

query:q

});





const lista =
data.results ||
data.items ||
data.data ||
[];





const resultados =
lista.map(v=>({


titulo:
v.title ||
v.titulo ||
"Sem título",


autor:
v.author ||
v.channel ||
"Desconhecido",


url:
v.url ||
v.link ||
v.videoUrl



}));





return res.json({

sucesso:true,

resultados:resultados


});





}catch(e){


return res.status(500).json({

sucesso:false,

erro:e.message

});


}



};
