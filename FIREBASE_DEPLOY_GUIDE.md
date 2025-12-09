# 🔥 Firebase Deploy Guide

## Files Created
✅ `firebase.json` - Firebase configuration
✅ `.firebaserc` - Project configuration (gerobak-jogja-123)
✅ `firestore.rules` - Security rules
✅ `firestore.indexes.json` - Database indexes

## Deploy Security Rules

### Method 1: Firebase CLI (Recommended)

```bash
# Deploy rules
firebase deploy --only firestore:rules
```

Expected output:
```
=== Deploying to 'gerobak-jogja-123'...

i  deploying firestore
i  firestore: checking firestore.rules for compilation errors...
✔  firestore: rules file firestore.rules compiled successfully
i  firestore: uploading rules firestore.rules...
✔  firestore: released rules firestore.rules to cloud.firestore

✔  Deploy complete!
```

### Method 2: Firebase Console (If CLI doesn't work)

1. **Go to Firebase Console**
   - https://console.firebase.google.com
   - Select project: **gerobak-jogja-123**

2. **Open Firestore Rules**
   - Click **Firestore Database** (left menu)
   - Click **Rules** tab (top)

3. **Copy Rules**
   - Open `firestore.rules` file
   - Copy ALL content

4. **Paste & Update**
   - Delete existing rules in console
   - Paste new rules
   - **IMPORTANT:** Update admin email on line 15:
     ```javascript
     'admin@gerobakjogja.com',  // ← Change to YOUR admin email!
     ```

5. **Publish**
   - Click **Publish** button
   - Wait for confirmation

## Update Admin Email

### In firestore.rules (line 15):
```javascript
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email in [
           'your-admin-email@example.com',  // ← UPDATE THIS!
           // Add more admin emails if needed
         ];
}
```

### Example:
```javascript
'admin@gerobakjogja.com',
'owner@gerobakjogja.com',
```

## Test Security Rules

### Test 1: Public Can Read
```javascript
// Open website (not logged in)
// Products should load
// ✅ Should work
```

### Test 2: Public Cannot Write
```javascript
// Open browser console (not logged in)
// Try: firebase.firestore().collection('products').add({name: 'test'})
// ❌ Should fail with "Missing or insufficient permissions"
```

### Test 3: Admin Can Write
```javascript
// Login to admin panel
// Create/edit/delete product
// ✅ Should work
```

## Troubleshooting

### Error: "Not in a Firebase app directory"
**Solution:** Files already created! Just run:
```bash
firebase deploy --only firestore:rules
```

### Error: "Permission denied"
**Cause:** Admin email not in rules
**Solution:** Update email in firestore.rules line 15

### Error: "Rules compilation failed"
**Cause:** Syntax error in rules
**Solution:** Check firestore.rules for typos

### Rules Not Working
```bash
# Force redeploy
firebase deploy --only firestore:rules --force

# Or deploy via console (Method 2)
```

## What These Rules Do

### ✅ Allowed:
- **Public users** can READ all data (products, blog, gallery, etc)
- **Admin users** can READ and WRITE all data

### ❌ Blocked:
- **Public users** CANNOT write/delete data
- **Non-admin users** CANNOT access admin functions
- **All users** CANNOT access undefined collections

### Security Features:
- Email-based admin verification
- Authentication required for writes
- Public read for website content
- Deny-by-default for unknown collections

## Current Configuration

**Project ID:** gerobak-jogja-123
**Rules File:** firestore.rules
**Indexes File:** firestore.indexes.json

**Collections Protected:**
- products
- testimonials
- blog
- faqs
- gallery
- audit_logs (admin only)

## Next Steps

1. ✅ Deploy rules (you're doing this now!)
2. ⚠️ Update admin email in rules
3. ✅ Test rules work
4. ✅ Verify security

## Quick Commands

```bash
# Deploy rules only
firebase deploy --only firestore:rules

# Deploy everything
firebase deploy

# Check current project
firebase projects:list

# Switch project (if needed)
firebase use gerobak-jogja-123
```

## Resources

- [Firebase Console](https://console.firebase.google.com)
- [Firestore Rules Docs](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Audit](docs/ADMIN_SECURITY_AUDIT.md)

---

**Status:** Ready to deploy!

**Command:** `firebase deploy --only firestore:rules`
