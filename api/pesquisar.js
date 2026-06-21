// api/pesquisar.js

const https = require("https");


const API =
"https://api.cyberhost.online";


const KEY =
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";



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
resultados:[]
});

}



const body =
JSON.stringify({

api_key:KEY,

q:q

});



const resposta =
await fetch(
API+"/youtube/search",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body
}
);



const texto =
await resposta.text();



console.log(
"CYBER RESPOSTA:",
texto
);




let data;


try{

data =
JSON.parse(texto);


}catch{


return res.json({

resultados:[],

erro:texto

});


}




const lista =
data.results ||
data.data ||
[];




res.json({

resultados:
lista.map(x=>({


titulo:
x.title || "Sem título",


artista:
x.artist || x.channel || "Desconhecido",


url:
x.url || x.link || ""



}))


});




}catch(e){


console.log(e);


res.status(500).json({

erro:e.message

});


}



};
