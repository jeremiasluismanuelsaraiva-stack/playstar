import {
auth
} from "./firebase.js";


import {
GoogleAuthProvider,
signInWithPopup,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



window.criarConta = async()=>{


let email =
document.getElementById("email").value;


let senha =
document.getElementById("senha").value;



try{

await createUserWithEmailAndPassword(
auth,
email,
senha
);


alert("Conta criada");


}catch(e){

alert(e.message);

}


}




window.entrar = async()=>{


let email =
document.getElementById("email").value;


let senha =
document.getElementById("senha").value;



try{


await signInWithEmailAndPassword(
auth,
email,
senha
);


alert("Entrou");


}catch(e){

alert(e.message);

}


}




window.googleLogin = async()=>{


try{


const provider =
new GoogleAuthProvider();



await signInWithPopup(
auth,
provider
);


alert("Login Google OK");



}catch(e){

alert(e.message);

}


}





window.sair = async()=>{


await signOut(auth);

location.reload();


}
