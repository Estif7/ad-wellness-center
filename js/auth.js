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

// ==================== DASHBOARD LINK HANDLER (Desktop + Mobile) ====================
async function updateDashboardLinks(user) {
    const desktopLink = document.querySelector('a.nav-link[href*="dashboard"]');
    const mobileLink = document.querySelector('.slicknav_menu a[href*="dashboard"]');

    if (!user) {
        resetDashboardLinks(desktopLink, mobileLink);
        return;
    }

    try {
        const token = await user.getIdTokenResult();
        const isAdmin = token.claims.admin === true;

        if (isAdmin) {
            // Admin Dashboard
            if (desktopLink) {
                desktopLink.textContent = "Admin Dashboard";
                desktopLink.href = "/admin/admin.html";
            }
            if (mobileLink) {
                mobileLink.textContent = "Admin Dashboard";
                mobileLink.href = "/admin/admin.html";
            }
        } else {
            // Regular User Dashboard
            if (desktopLink) {
                desktopLink.textContent = "My Dashboard";
                desktopLink.href = "/dashboard.html";
            }
            if (mobileLink) {
                mobileLink.textContent = "My Dashboard";
                mobileLink.href = "/dashboard.html";
            }
        }
    } catch (e) {
        console.error("Error checking admin role:", e);
    }
}

function resetDashboardLinks(desktopLink, mobileLink) {
    if (desktopLink) {
        desktopLink.textContent = "My Dashboard";
        desktopLink.href = "/dashboard.html";
    }
    if (mobileLink) {
        mobileLink.textContent = "My Dashboard";
        mobileLink.href = "/dashboard.html";
    }
}

// ==================== MENU HELPERS ====================
function getOrCreateAboutMenuItem() {
    let aboutMenuItem = document.querySelector('a.nav-link[href*="/about"]')?.closest('li.nav-item');
    
    if (!aboutMenuItem) {
        const profileMenuItem = document.querySelector('a.nav-link[href*="/profile"]')?.closest('li.nav-item');
        if (profileMenuItem && profileMenuItem.parentNode) {
            aboutMenuItem = document.createElement('li');
            aboutMenuItem.className = 'nav-item';
            aboutMenuItem.innerHTML = '<a class="nav-link" href="about.html">About Us</a>';
            profileMenuItem.parentNode.insertBefore(aboutMenuItem, profileMenuItem);
        }
    }
    return aboutMenuItem;
}

function updateMainMenu(isLoggedIn) {
    const profileMenuItem = document.querySelector('a.nav-link[href*="/profile"]')?.closest('li.nav-item');
    const dashboardMenuItem = document.querySelector('a.nav-link[href*="/dashboard"]')?.closest('li.nav-item');
    const aboutMenuItem = getOrCreateAboutMenuItem();

    if (profileMenuItem) profileMenuItem.style.display = isLoggedIn ? 'list-item' : 'none';
    if (dashboardMenuItem) dashboardMenuItem.style.display = isLoggedIn ? 'list-item' : 'none';
    if (aboutMenuItem) aboutMenuItem.style.display = isLoggedIn ? 'none' : 'list-item';

    updateMobileMainMenu(isLoggedIn);
}

function updateMobileMainMenu(isLoggedIn) {
    const mobileProfileItem = document.querySelector('.slicknav_menu a[href*="/profile"]')?.closest('li');
    const mobileDashboardItem = document.querySelector('.slicknav_menu a[href*="/dashboard"]')?.closest('li');
    let mobileAboutItem = document.querySelector('.slicknav_menu a[href*="/about"]')?.closest('li');

    if (!mobileAboutItem && mobileProfileItem) {
        mobileAboutItem = mobileProfileItem.cloneNode(true);
        mobileAboutItem.querySelector('a').href = 'about.html';
        mobileAboutItem.querySelector('a').textContent = 'About Us';
        mobileProfileItem.parentNode.insertBefore(mobileAboutItem, mobileProfileItem);
    }

    if (mobileProfileItem) mobileProfileItem.style.display = isLoggedIn ? 'list-item' : 'none';
    if (mobileDashboardItem) mobileDashboardItem.style.display = isLoggedIn ? 'list-item' : 'none';
    if (mobileAboutItem) mobileAboutItem.style.display = isLoggedIn ? 'none' : 'list-item';
}

// ==================== AUTH STATE LISTENER ====================
onAuthStateChanged(auth, async (user) => {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const userInfo = document.getElementById("user-info");

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

        if (window.updateMobileAuthMenu) {
            window.updateMobileAuthMenu(true, welcomeText);
        }

        // Update dashboard links for both desktop and mobile
        await updateDashboardLinks(user);

    } else {
        // ❌ Logged out
        if (logoutBtn) logoutBtn.style.display = "none";
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (userInfo) userInfo.innerHTML = "";
        updateMainMenu(false);

        if (window.updateMobileAuthMenu) {
            window.updateMobileAuthMenu(false, "");
        }

        // Reset dashboard links
        const desktopLink = document.querySelector('a.nav-link[href*="dashboard"]');
        const mobileLink = document.querySelector('.slicknav_menu a[href*="dashboard"]');
        resetDashboardLinks(desktopLink, mobileLink);
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