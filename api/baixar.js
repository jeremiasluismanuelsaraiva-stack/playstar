const https = require("https");


const API =
"https://api.cyberhost.online";


const KEY =
"cyber_f857ee31300990f3451d1a6826f9913b74d52f0a";



function cyber(body){


return new Promise((resolve,reject)=>{


let data = JSON.stringify({

api_key:KEY,

...body

});



let req=https.request(

API+"/youtube/download",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"Content-Length":
Buffer.byteLength(data)

}

},


res=>{


let out="";


res.on(
"data",
c=>out+=c
);


res.on(
"end",
()=>{


try{

resolve(JSON.parse(out));

}catch(e){

reject(new Error(out));

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

erro:"Sem link"

});

}



const data =
await cyber({

url:url,

type:
tipo==="video"
?
"video"
:
"audio",


format:
tipo==="video"
?
"mp4"
:
"mp3",


quality:"720"


});





let file =
data.file ||
data.download ||
data.url;




if(!file){


return res.json({

sucesso:false,

erro:"Sem ficheiro",

resposta:data

});


}




if(!file.startsWith("http")){


file =
API+file;


}





res.json({

sucesso:true,

download:file

});




}catch(e){


res.status(500).json({

sucesso:false,

erro:e.message

});


}


};
