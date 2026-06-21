const API =
"https://api.cyberhost.online";


const KEY =
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";



export default async function handler(req,res){


try{


const q = req.query.q;


if(!q){

return res.status(400).json({

erro:"Falta pesquisa"

});

}



// Se for link direto

if(
q.includes("youtube.com") ||
q.includes("youtu.be")
){


return res.json({

resultados:[

{

titulo:"YouTube",

artista:"Vídeo encontrado",

url:q

}

]

});

}



// Pesquisa por nome


const response =
await fetch(

`${API}/youtube/search?q=${encodeURIComponent(q)}`,

{

headers:{

"x-api-key":KEY,

"Content-Type":"application/json"

}

}

);



const data =
await response.json()
.catch(()=>({}));





const resultados =

data.results ||
data.data ||
[];





return res.json({

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
x.link ||
x.video_url


}))


});





}catch(e){


console.log(e);


return res.status(500).json({

erro:e.message

});


}


}
