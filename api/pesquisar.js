// PLAYSTAR TESTE PESQUISA

module.exports = async (req,res)=>{


res.setHeader(
"Content-Type",
"application/json"
);


try{


const q =
req.query.q || "Akon";



return res.status(200).json({

sucesso:true,

resultados:[

{
titulo:"Lonely",
artista:"Akon",
url:"https://youtube.com/watch?v=test"
},

{
titulo:"Right Now",
artista:"Akon",
url:"https://youtube.com/watch?v=test2"
},

{
titulo:"Smack That",
artista:"Akon ft Eminem",
url:"https://youtube.com/watch?v=test3"
}

],

pesquisa:q


});



}catch(e){


return res.status(500).json({

erro:e.message

});


}


};
