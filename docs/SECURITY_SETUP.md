# 🔒 Security Setup Guide

## ⚠️ CRITICAL: Deploy Firestore Security Rules

### Current Status
❌ **NO SECURITY RULES** - Anyone can read/write your database!

### Quick Fix (5 minutes)

#### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### Step 2: Login to Firebase
```bash
firebase login
```

#### Step 3: Initialize Firebase (if not done)
```bash
firebase init firestore
```

Select:
- Use existing project
- Choose your project
- Accept default firestore.rules location
- Accept default firestore.indexes.json location

#### Step 4: Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

Expected output:
```
✔ Deploy complete!
```

#### Step 5: Verify Rules
1. Go to Firebase Console
2. Firestore Database > Rules
3. Should see the rules deployed

### Test Security

#### Test 1: Public Read (Should Work)
```javascript
// Try reading products without auth
// Should work - products are public
```

#### Test 2: Public Write (Should Fail)
```javascript
// Try creating product without auth
// Should fail with "Permission denied"
```

#### Test 3: Admin Write (Should Work)
```javascript
// Login as admin
// Try creating product
// Should work
```

## Security Rules Explained

### What's Protected

```javascript
// Products
✅ Anyone can READ products (public website needs this)
❌ Only admins can CREATE/UPDATE/DELETE

// Testimonials, Blog, FAQ, Gallery
✅ Anyone can READ (public display)
❌ Only admins can WRITE

// All other collections
❌ Completely blocked
```

### Admin Email

Update `firestore.rules` line 15:
```javascript
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email in [
           'admin@gerobakjogja.com',  // ← Change this!
           'your-email@example.com',   // ← Add more if needed
         ];
}
```

## Additional Security Measures

### 1. Add Input Sanitization to Admin Forms

Update `src/pages/Admin.jsx`:

```javascript
import { sanitizeText, sanitizePrice, sanitizeUrl } from '../utils/sanitize';

// In handleSubmit
const productData = {
  name: sanitizeText(formData.name, 100),
  category: formData.category,
  price: sanitizePrice(formData.price),
  shortDesc: sanitizeText(formData.shortDesc, 200),
  description: sanitizeText(formData.description, 1000),
  badge: sanitizeText(formData.badge, 50),
  images: formData.images.map(url => sanitizeUrl(url)),
  // ...
};
```

### 2. Add Session Timeout

Add to `src/context/AuthContext.jsx`:

```javascript
// Auto logout after 30 minutes of inactivity
useEffect(() => {
  if (!user) return;
  
  let timeout;
  const resetTimeout = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      logout();
      alert('Session expired. Please login again.');
    }, 30 * 60 * 1000); // 30 minutes
  };
  
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.addEventListener(event, resetTimeout);
  });
  
  resetTimeout();
  
  return () => {
    clearTimeout(timeout);
    events.forEach(event => {
      window.removeEventListener(event, resetTimeout);
    });
  };
}, [user, logout]);
```

### 3. Add Audit Logging

Create `src/utils/auditLog.js`:

```javascript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function logAction(user, action, details) {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      userEmail: user.email,
      userId: user.uid,
      action: action, // 'create', 'update', 'delete'
      details: details, // { collection: 'products', id: '123', ... }
      timestamp: serverTimestamp(),
      ip: null, // Can't get IP on client-side
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
}
```

Use in Admin.jsx:
```javascript
import { logAction } from '../utils/auditLog';

// After successful create
await addProduct(productData);
await logAction(user, 'create', { 
  collection: 'products', 
  name: productData.name 
});
```

### 4. Add Rate Limiting

Use the RateLimiter from sanitize.js:

```javascript
import { RateLimiter } from '../utils/sanitize';

// In Admin component
const loginLimiter = new RateLimiter(5, 60000); // 5 attempts per minute

const handleLogin = async (e) => {
  e.preventDefault();
  
  if (!loginLimiter.canMakeRequest()) {
    const waitTime = Math.ceil(loginLimiter.getTimeUntilReset() / 1000);
    setLoginError(`Too many attempts. Wait ${waitTime} seconds.`);
    return;
  }
  
  // ... rest of login code
};
```

## Security Checklist

### Immediate (Today)
- [ ] Deploy Firestore security rules
- [ ] Update admin email in rules
- [ ] Test rules work correctly
- [ ] Verify public can't write

### This Week
- [ ] Add input sanitization
- [ ] Add session timeout
- [ ] Add audit logging
- [ ] Add rate limiting

### This Month
- [ ] Enable 2FA for admin
- [ ] Add IP whitelisting
- [ ] Regular security audits
- [ ] Monitor audit logs

## Testing

### Test Security Rules

```bash
# Install Firebase emulator
firebase init emulators

# Start emulator
firebase emulators:start

# Run tests
npm test
```

### Manual Testing

1. **Test Public Read**
   - Open website in incognito
   - Products should load
   - ✅ Should work

2. **Test Public Write**
   - Open browser console
   - Try: `firebase.firestore().collection('products').add({...})`
   - ❌ Should fail

3. **Test Admin Write**
   - Login to admin panel
   - Create a product
   - ✅ Should work

## Monitoring

### Firebase Console

1. **Check Usage**
   - Go to Firebase Console
   - Usage tab
   - Monitor read/write operations

2. **Check Errors**
   - Functions tab
   - Check for errors
   - Set up alerts

3. **Review Logs**
   - Firestore > Data
   - Check audit_logs collection
   - Review admin actions

### Set Up Alerts

1. Go to Firebase Console
2. Project Settings > Integrations
3. Enable Cloud Monitoring
4. Set up alerts for:
   - High error rates
   - Unusual traffic
   - Failed auth attempts

## Common Issues

### Issue 1: Rules Not Working
```bash
# Clear cache and redeploy
firebase deploy --only firestore:rules --force
```

### Issue 2: Admin Can't Write
```bash
# Check admin email in rules
# Make sure it matches exactly
# Case sensitive!
```

### Issue 3: Public Can't Read
```bash
# Check rules allow read: if true
# For public collections
```

## Resources

- [Firebase Security Rules Docs](https://firebase.google.com/docs/rules)
- [Firestore Security Best Practices](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Security Audit Guide](docs/ADMIN_SECURITY_AUDIT.md)

## Summary

**Current Security:** ⚠️ **VULNERABLE**

**After Setup:** ✅ **SECURE**

**Time Required:** 5-10 minutes

**Priority:** 🔴 **CRITICAL - DO NOW!**

---

**Next Steps:**
1. Run: `firebase deploy --only firestore:rules`
2. Test rules work
3. Update admin email
4. Add additional security measures

**Questions?** Check [ADMIN_SECURITY_AUDIT.md](docs/ADMIN_SECURITY_AUDIT.md)
