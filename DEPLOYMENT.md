# Firebase Hosting Deployment Guide

## Prerequisites
1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

## Deployment Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Initialize Firebase Hosting** (only first time):
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite `dist/index.html`

3. **Deploy to Firebase Hosting**:
   ```bash
   firebase deploy --only hosting
   ```

## Environment Variables

For production deployment, update your Firebase config in `src/firebase/config.js` with your production Firebase project credentials.

## Build Commands

- Development: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`
- Deploy: `firebase deploy --only hosting`

## Notes

- The `dist` folder contains the built application
- Firebase Hosting will serve the app as a SPA
- All routes will redirect to `index.html`
- Static assets are cached for 1 year