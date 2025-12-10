# 🔍 Firestore Rules Debugging

## Error: "Missing or insufficient permissions"

### Possible Causes

#### 1. Rules Not Propagated Yet ⏳
**Wait Time:** 1-2 minutes after deploy

**Solution:** Wait and refresh page

#### 2. Rules Syntax Error ❌
**Check:** Firebase Console for errors

**Solution:** Fix syntax and redeploy

#### 3. Email Not Matching ⚠️
**Most Common Issue!**

**Check:**
- Email in rules must EXACTLY match login email
- Case sensitive!
- No extra spaces

#### 4. Collection Name Mismatch 📝
**Check:** Collection name in code vs rules

## Quick Debug Steps

### Step 1: Check Rules in Firebase Console

1. Go to: https://console.firebase.google.com
2. Select project: **gerobak-jogja-123**
3. Firestore Database → Rules tab
4. Check if rules are there
5. Look for any error messages

### Step 2: Verify Email

**In firestore.rules (line 15):**
```javascript
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email in [
           'admin@gerobakjogja.com',  // ← Check this!
         ];
}
```

**Your actual admin email:**
- Check what email you use to login
- Must match EXACTLY

### Step 3: Test with Open Rules (Temporary)

**Paste this in Firebase Console Rules (TEMPORARY!):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // TEMPORARY - Allow all for testing
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Click Publish**

**Test:**
- If error gone → Rules syntax is correct, email is wrong
- If error still there → Different issue

**IMPORTANT:** Change back to secure rules after testing!

### Step 4: Check Browser Console

Open browser console and check:
```javascript
// Check if user is logged in
firebase.auth().currentUser

// Check user email
firebase.auth().currentUser?.email
```

## Common Issues & Solutions

### Issue 1: Email Case Mismatch

**Problem:**
```javascript
// In rules
'admin@gerobakjogja.com'

// Actual login
'Admin@gerobakjogja.com'  // Capital A!
```

**Solution:**
```javascript
// Make email lowercase in rules
'admin@gerobakjogja.com'

// Or use multiple variations
'admin@gerobakjogja.com',
'Admin@gerobakjogja.com'
```

### Issue 2: Wrong Collection Name

**Problem:**
```javascript
// In code
collection(db, 'blogPosts')  // camelCase

// In rules
match /blog/{postId}  // lowercase
```

**Solution:** Make sure names match!

### Issue 3: Not Logged In

**Problem:** Trying to write without authentication

**Solution:** Login first, then try again

### Issue 4: Rules Not Deployed

**Check:**
```bash
firebase deploy --only firestore:rules

# Should see:
# ✔ Deploy complete!
```

**If error:**
```bash
# Check syntax
firebase deploy --only firestore:rules --debug
```

## Recommended: Simple Rules for Testing

**Use this temporarily to test:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Products - anyone can read, auth users can write
    match /products/{productId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Blog - anyone can read, auth users can write
    match /blog/{postId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Testimonials - anyone can read, auth users can write
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // FAQ - anyone can read, auth users can write
    match /faqs/{faqId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Gallery - anyone can read, auth users can write
    match /gallery/{imageId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Audit logs - only auth users
    match /audit_logs/{logId} {
      allow read, write: if isAuthenticated();
    }
    
    // Deny all others
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**This allows ANY authenticated user to write.**
**More permissive but easier to debug.**

## After Rules Work

Once you confirm rules work with simple version:

1. **Add email check back:**
```javascript
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email == 'YOUR_ACTUAL_EMAIL@example.com';
}
```

2. **Replace `isAuthenticated()` with `isAdmin()`:**
```javascript
allow write: if isAdmin();
```

3. **Deploy again:**
```bash
firebase deploy --only firestore:rules
```

## Quick Test Commands

### Test in Browser Console

```javascript
// 1. Check if logged in
console.log('User:', firebase.auth().currentUser);

// 2. Check email
console.log('Email:', firebase.auth().currentUser?.email);

// 3. Try to read blog
firebase.firestore().collection('blog').get()
  .then(snap => console.log('Read success:', snap.size))
  .catch(err => console.error('Read error:', err));

// 4. Try to write (after login)
firebase.firestore().collection('blog').add({test: true})
  .then(doc => console.log('Write success:', doc.id))
  .catch(err => console.error('Write error:', err));
```

## What Email Are You Using?

**Check your .env file or login form:**
- What email do you use to login?
- Copy it EXACTLY
- Paste in rules (line 15)
- No typos!
- No extra spaces!

## Still Not Working?

### Last Resort: Screenshot Rules

1. Take screenshot of Firebase Console Rules tab
2. Take screenshot of your login email
3. Compare them character by character

### Or: Use Simple Rules

Just use the "Simple Rules for Testing" above.
It allows any authenticated user to write.
Good enough for now, can tighten later.

---

**Most Likely Issue:** Email in rules doesn't match login email!

**Quick Fix:** Use simple rules (any authenticated user can write)
