# Admin Scripts Setup

⚠️ **IMPORTANT**: These scripts require Firebase service account credentials to run.

## Setup Instructions

### 1. Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **dagi-aman-gym**
3. Go to **Project Settings** (gear icon)
4. Click **Service Accounts**
5. Click **Generate New Private Key**
6. Save the downloaded JSON file as `serviceAccountKey.json` in this folder

### 2. Set Environment Variable

**Windows (PowerShell):**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
```

**Windows (CMD):**
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=.\serviceAccountKey.json
```

**Mac/Linux:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
```

### 3. Run Scripts

```powershell
# Make a user admin
node set-admin.js <USER_UID>

# Manage users (suspend/unsuspend/delete)
node manage-users.js suspend <USER_UID>
node manage-users.js unsuspend <USER_UID>
node manage-users.js delete <USER_UID>
```

## Security Notes

- ⚠️ **Never commit** `serviceAccountKey.json` to version control
- The `.gitignore` file prevents this file from being tracked
- If credentials are ever exposed, regenerate them immediately in Firebase Console