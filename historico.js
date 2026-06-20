import {
db,
auth
} from "./firebase.js";


import {
collection,
addDoc,
getDocs,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




export async function guardarHistorico(item){


if(!auth.currentUser)
return;



await addDoc(

collection(
db,
"usuarios",
auth.currentUser.uid,
"historico"
),

{

nome:item.nome,

link:item.url,

download:item.download,

tipo:item.tipo,

data:serverTimestamp()

}

);


}





export async function carregarHistorico(){


if(!auth.currentUser)
return [];


let lista=[];



const snap =
await getDocs(

collection(
db,
"usuarios",
auth.currentUser.uid,
"historico"
)

);



snap.forEach(doc=>{

lista.push(doc.data());

});



return lista;


}
