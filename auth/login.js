// login.js - With Login Page Protection + Smart Redirect
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD01C6Flcgy_so_EvWNTINttczzoexJPck",
    authDomain: "dagi-aman-gym.firebaseapp.com",
    projectId: "dagi-aman-gym",
    storageBucket: "dagi-aman-gym.firebasestorage.app",
    messagingSenderId: "193829259951",
    appId: "1:193829259951:web:64cc23ec8499006519e25a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======================
// LOGIN PAGE PROTECTION
// ======================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Check if user is suspended
            const profileRef = doc(db, "clientProfiles", user.uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists() && profileSnap.data().suspended === true) {
                alert("Your account has been suspended. Please contact support.");
                await auth.signOut();   // Force sign out
                return;
            }

            // Normal smart redirect
            const idTokenResult = await user.getIdTokenResult();
            if (idTokenResult.claims.admin === true) {
                window.location.href = "/admin/admin.html";
                return;
            }

            if (profileSnap.exists()) {
                window.location.href = "/index.html";
            } else {
                window.location.href = "/profile.html";
            }
        } catch (error) {
            console.error("Redirect error:", error);
            window.location.href = "/index.html";
        }
    }
});

// ======================
// LOGIN FORM HANDLER
// ======================
const submit = document.getElementById('submit');

if (submit) {
    submit.addEventListener('click', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value || document.querySelector('input[placeholder="E-mail Address"]').value;
        const password = document.getElementById('password').value || document.querySelector('input[type="password"]').value;

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Same smart redirect as protection
            const idTokenResult = await user.getIdTokenResult();
            if (idTokenResult.claims.admin === true) {
                window.location.href = "/admin/admin.html";
                return;
            }

            const profileRef = doc(db, "clientProfiles", user.uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                window.location.href = "/index.html";
            } else {
                window.location.href = "/profile.html";
            }

        } catch (error) {
            console.error(error);
            alert("Login failed: " + error.message);
        }
    });
}