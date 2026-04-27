const admin = require('firebase-admin');

// IMPORTANT: Set environment variable before running:
//   export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
// Or use Firebase CLI: firebase use <project-id>

// Use environment variable for credentials (secure approach)
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log("⚠️  No credentials detected.");
    console.log("Please set GOOGLE_APPLICATION_CREDENTIALS environment variable:");
    console.log("   - Download service account from Firebase Console");
    console.log("   - Save as 'serviceAccountKey.json' in admin/ folder");
    console.log("   - Run: $env:GOOGLE_APPLICATION_CREDENTIALS='./serviceAccountKey.json'");
    console.log("   - Then run: node set-admin.js <UID>");
    process.exit(1);
}

// Initialize with application default credentials
try {
    admin.initializeApp();
} catch (e) {
    if (e.code === 'app/duplicate-app') {
        console.log("App already initialized");
    } else {
        throw e;
    }
}

const uid = process.argv[2];   // Pass UID as command line argument

if (!uid) {
  console.error("❌ Please provide the User UID: node set-admin.js YOUR_UID_HERE");
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Success! User ${uid} is now an ADMIN.`);
    console.log("The claim will take effect on next login or token refresh.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error setting admin claim:", error);
    process.exit(1);
  });