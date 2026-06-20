const https = require("https");


const API_CYBERHOST =
"https://api.cyberhost.online";


const API_KEY_CYBERHOST =
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";



function postCyber(endpoint, body){


return new Promise((resolve,reject)=>{


const data = JSON.stringify({

api_key: API_KEY_CYBERHOST,

...body

});



const req = https.request(

API_CYBERHOST + endpoint,

{

method:"POST",

headers:{

"Content-Type":"application/json",

"Content-Length":
Buffer.byteLength(data)

}

},



(res)=>{


let result="";



res.on("data",chunk=>{

result += chunk;

});



res.on("end",()=>{


console.log(
"CYBER:",
result
);



try{


resolve(JSON.parse(result));


}catch(e){


reject(
new Error(result)
);


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


const url =
req.query.url;


const tipo =
req.query.tipo || "audio";



if(!url){


return res.json({

sucesso:false,

erro:"Sem URL"

});


}





let endpoint = "";


let body = {

url:url

};






if(
url.includes("youtube.com") ||
url.includes("youtu.be")
){


endpoint =
"/youtube/download";



body.type =
tipo === "video"
?
"video"
:
"audio";



body.format =
tipo === "video"
?
"mp4"
:
"mp3";



body.quality="720";



}







else if(
url.includes("tiktok.com")
){


endpoint =
"/tiktok/download";


}







else if(
url.includes("facebook.com") ||
url.includes("fb.watch")
){


endpoint =
"/facebook/download";


}







else{


return res.json({

sucesso:false,

erro:"Link não suportado"

});


}








const data =
await postCyber(
endpoint,
body
);






const link =

data.file ||

data.download ||

data.url ||

data.result;







if(!link){


return res.json({

sucesso:false,

erro:"Sem vídeo retornado pela API",

resposta:data

});


}








return res.json({

sucesso:true,

download:

link.startsWith("http")

?

link

:

API_CYBERHOST + link



});







}catch(e){



return res.status(500).json({

sucesso:false,

erro:e.message

});


}



};
