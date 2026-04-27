// manage-users.js - Admin tool for Suspend / Unsuspend / Delete users
// IMPORTANT: Set these environment variables before running:
//   export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
// Or use Firebase CLI: firebase use <project-id>

const admin = require('firebase-admin');

// Use environment variable for credentials (secure approach)
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIREBASE_PROJECT_ID) {
    console.log("⚠️  No credentials detected. Please set either:");
    console.log("   - GOOGLE_APPLICATION_CREDENTIALS: path to service account JSON");
    console.log("   - FIREBASE_PROJECT_ID: your Firebase project ID");
    console.log("\nFor local development, download service account from Firebase Console");
    console.log("and save as 'serviceAccountKey.json' in the admin/ folder.");
    console.log("Then set: $env:GOOGLE_APPLICATION_CREDENTIALS='./serviceAccountKey.json'");
    process.exit(1);
}

// Initialize with application default credentials (works with GOOGLE_APPLICATION_CREDENTIALS)
try {
    admin.initializeApp({
        // databaseURL optional but recommended
    });
} catch (e) {
    if (e.code === 'app/duplicate-app') {
        console.log("App already initialized");
    } else {
        throw e;
    }
}

const auth = admin.auth();
const db = admin.firestore();

// Command line usage examples:
// node manage-users.js suspend <UID>
// node manage-users.js unsuspend <UID>
// node manage-users.js delete <UID>

const command = process.argv[2];
const uid = process.argv[3];

if (!command || !uid) {
    console.log("Usage:");
    console.log("  node manage-users.js suspend <UID>");
    console.log("  node manage-users.js unsuspend <UID>");
    console.log("  node manage-users.js delete <UID>");
    process.exit(1);
}

async function main() {
    try {
        if (command === "suspend") {
            await auth.setCustomUserClaims(uid, { suspended: true });
            await db.collection("clientProfiles").doc(uid).update({ suspended: true });
            console.log(`✅ User ${uid} has been SUSPENDED.`);
            console.log("   They will be logged out on next token refresh (or page reload).");

        } else if (command === "unsuspend") {
            await auth.setCustomUserClaims(uid, { suspended: false });
            await db.collection("clientProfiles").doc(uid).update({ suspended: false });
            console.log(`✅ User ${uid} has been UNSUSPENDED.`);

        } else if (command === "delete") {
            console.log(`⚠️  Deleting user ${uid}...`);

            // Delete Firestore data
            await db.collection("clientProfiles").doc(uid).delete().catch(() => {});
            const contentSnap = await db.collection("personalizedContent").where("clientId", "==", uid).get();
            contentSnap.docs.forEach(doc => doc.ref.delete());
            const msgSnap = await db.collection("messages").where("clientId", "==", uid).get();
            msgSnap.docs.forEach(doc => doc.ref.delete());

            // Permanently delete from Firebase Authentication
            await auth.deleteUser(uid);
            console.log(`✅ User ${uid} has been PERMANENTLY DELETED from Auth and Firestore.`);
            console.log("   This email cannot be reused immediately.");

        } else {
            console.log("Unknown command. Use: suspend, unsuspend, or delete");
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

main();