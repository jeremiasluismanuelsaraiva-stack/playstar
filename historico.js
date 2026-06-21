// ============================
// PLAYSTAR HISTÓRICO FIREBASE
// ============================


import {

db,
auth

} from "./firebase.js";



import {

collection,
addDoc,
getDocs,
serverTimestamp,
query,
orderBy

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







// ============================
// GUARDAR HISTÓRICO
// ============================


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


nome:
item.nome ||
"🎵 Música",



artista:
item.artista ||
"PlayStar",



url:
item.url ||
"",



download:
item.download ||
"",



tipo:
item.tipo ||
"audio",



data:
serverTimestamp()



}



);



}








// ============================
// CARREGAR HISTÓRICO
// ============================


export async function carregarHistorico(){



if(!auth.currentUser)

return [];





let lista=[];






const ref = collection(


db,


"usuarios",


auth.currentUser.uid,


"historico"



);






const q = query(


ref,


orderBy(

"data",

"desc"

)



);







const snap =
await getDocs(q);






snap.forEach(doc=>{



lista.push({


id:doc.id,


...doc.data()



});



});






return lista;



}
