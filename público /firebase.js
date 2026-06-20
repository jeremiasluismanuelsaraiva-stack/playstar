import {
initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const firebaseConfig = {

apiKey:"AIzaSyA7-uHk2pY578l8ICXmjhDWXTuo0Id-Umc",

authDomain:"playstar-74339.firebaseapp.com",

projectId:"playstar-74339",

storageBucket:"playstar-74339.firebasestorage.app",

messagingSenderId:"516836103698",

appId:"1:516836103698:web:6f26dca949653a877a6acb"

};



const app =
initializeApp(firebaseConfig);


const auth =
getAuth(app);


const db =
getFirestore(app);



export {
auth,
db
};
