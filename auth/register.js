  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

  // https://firebase.google.com/docs/web/setup#available-libraries

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
  const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        alert('User registered successfully!');
        window.location.href = "login.html"; 
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  })