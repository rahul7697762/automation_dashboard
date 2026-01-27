# Firebase Database Rules Setup

## Issue: Articles Not Appearing in History

The most likely cause is that **Firebase Realtime Database rules are blocking writes**.

## Quick Fix:

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select project: `seo-automation-a90f2`

2. **Navigate to Realtime Database:**
   - Click "Realtime Database" in left sidebar
   - Click "Rules" tab

3. **Update Rules for Development:**

```json
{
  "rules": {
    "articles": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. **Click "Publish"**

## Check Browser Console

Open browser console (F12) and look for errors like:
- `PERMISSION_DENIED`
- `Firebase Database write failed`

## Test After Rule Update

1. Generate a new article
2. Check console for "Article saved successfully to Firebase!"
3. Article should appear in history
4. Refresh page - article should persist

## Production Rules (Use Later)

```json
{
  "rules": {
    "articles": {
      ".read": true,
      ".write": "auth != null",
      "$articleId": {
        ".validate": "newData.hasChildren(['topic', 'content', 'createdAt'])"
      }
    }
  }
}
```

This requires authentication which you can add later.
