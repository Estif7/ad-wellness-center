// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD01C6Flcgy_so_EvWNTINttczzoexJPck",
  authDomain: "dagi-aman-gym.firebaseapp.com",
  projectId: "dagi-aman-gym",
  storageBucket: "dagi-aman-gym.firebasestorage.app",
  messagingSenderId: "193829259951",
  appId: "1:193829259951:web:64cc23ec8499006519e25a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submit = document.getElementById('submit');
submit.addEventListener('click', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('Password reset email sent. Check your inbox.');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
});
