// js/auth.js - Smart Header with Dynamic Dashboard Link + Mobile Menu Sync

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
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

const profileMenuItem = document.querySelector('a.nav-link[href="profile.html"]')?.closest('li.nav-item');
const dashboardMenuItem = document.querySelector('a.nav-link[href="dashboard.html"]')?.closest('li.nav-item');
let aboutMenuItem = document.querySelector('a.nav-link[href="about.html"]')?.closest('li.nav-item');

function ensureAboutMenuItem() {
    if (!aboutMenuItem && profileMenuItem) {
        aboutMenuItem = document.createElement('li');
        aboutMenuItem.className = 'nav-item';
        aboutMenuItem.innerHTML = '<a class="nav-link" href="about.html">About Us</a>';
        profileMenuItem.parentNode.insertBefore(aboutMenuItem, profileMenuItem);
    }
}

function updateMainMenu(isLoggedIn) {
    if (!aboutMenuItem) ensureAboutMenuItem();

    if (profileMenuItem) profileMenuItem.style.display = isLoggedIn ? 'list-item' : 'none';
    if (dashboardMenuItem) dashboardMenuItem.style.display = isLoggedIn ? 'list-item' : 'none';
    if (aboutMenuItem) aboutMenuItem.style.display = isLoggedIn ? 'none' : 'list-item';

    updateMobileMainMenu(isLoggedIn);
}

function updateMobileMainMenu(isLoggedIn) {
    const mobileProfileItem = document.querySelector('.slicknav_menu a[href="profile.html"]')?.closest('li');
    const mobileDashboardItem = document.querySelector('.slicknav_menu a[href="dashboard.html"]')?.closest('li');
    let mobileAboutItem = document.querySelector('.slicknav_menu a[href="about.html"]')?.closest('li');

    if (!mobileAboutItem) {
        const mobileNav = document.querySelector('.slicknav_menu ul');
        if (mobileNav && mobileProfileItem) {
            // Clone the structure from an existing item to match styling
            mobileAboutItem = mobileProfileItem.cloneNode(true);
            mobileAboutItem.querySelector('a').href = 'about.html';
            mobileAboutItem.querySelector('a').textContent = 'About Us';
            mobileProfileItem.parentNode.insertBefore(mobileAboutItem, mobileProfileItem);
        }
    }

    if (mobileProfileItem) mobileProfileItem.style.display = isLoggedIn ? 'list-item' : 'none';
    if (mobileDashboardItem) mobileDashboardItem.style.display = isLoggedIn ? 'list-item' : 'none';
    if (mobileAboutItem) mobileAboutItem.style.display = isLoggedIn ? 'none' : 'list-item';
}

updateMainMenu(false);

onAuthStateChanged(auth, async (user) => {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const userInfo = document.getElementById("user-info");

    // Dashboard link
    const dashboardLink = document.querySelector('a.nav-link[href="dashboard.html"]');

    if (user) {
        // ✅ Logged in
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        updateMainMenu(true);

        let displayName = user.email.split('@')[0];

        // Try to get full name from Firestore
        try {
            const profileSnap = await getDoc(doc(db, "clientProfiles", user.uid));
            if (profileSnap.exists() && profileSnap.data().fullName) {
                displayName = profileSnap.data().fullName.trim();
            }
        } catch (e) {
            console.error("Error fetching profile:", e);
        }

        const welcomeText = `Welcome, ${displayName}!`;

        if (userInfo) userInfo.innerHTML = welcomeText;

        // ✅ Update mobile menu (NEW)
        if (window.updateMobileAuthMenu) {
            window.updateMobileAuthMenu(true, welcomeText);
        }

        // === SMART DASHBOARD LINK ===
        if (dashboardLink) {
            try {
                const token = await user.getIdTokenResult();
                const isAdmin = token.claims.admin === true;

                if (isAdmin) {
                    dashboardLink.textContent = "Admin Dashboard";
                    dashboardLink.href = "/admin/admin.html";
                } else {
                    dashboardLink.textContent = "My Dashboard";
                    dashboardLink.href = "/dashboard.html";
                }
            } catch (e) {
                console.error("Error checking admin role:", e);
            }
        }

    } else {
        // ❌ Logged out
        if (logoutBtn) logoutBtn.style.display = "none";
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (userInfo) userInfo.innerHTML = "";
        updateMainMenu(false);

        // ✅ Update mobile menu (NEW)
        if (window.updateMobileAuthMenu) {
            window.updateMobileAuthMenu(false, "");
        }

        // Reset dashboard link
        if (dashboardLink) {
            dashboardLink.textContent = "My Dashboard";
            dashboardLink.href = "/dashboard.html";
        }
    }
});

// Logout function
window.logout = function () {
    signOut(auth)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch(err => console.error(err));
};

// Login redirect
window.login = function () {
    window.location.href = "/auth/login.html";
};