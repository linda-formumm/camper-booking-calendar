# GitHub Pages Troubleshooting

## Issue: White page on GitHub Pages deployment

### Expected URL:

https://linda-formumm.github.io/camper-booking-calendar/

### Checks performed:

1. ✅ Vite base path correctly set to `/camper-booking-calendar/`
2. ✅ GitHub Actions workflow correctly configured
3. ✅ SPA fallback (404.html) in place
4. ✅ Build artifacts include correct base path in HTML

### Next steps to check:

1. **GitHub Repository Settings > Pages**:
   - Source should be set to "GitHub Actions" (not "Deploy from a branch")
   - This is required for our custom workflow to work

2. **GitHub Actions Tab**:
   - Check if workflow ran successfully
   - Look for any deployment errors

3. **Browser Developer Tools**:
   - Check if CSS/JS files are loading with correct paths
   - Look for 404 errors in Network tab

### Manual fix if needed:

If GitHub Pages source is set to "Deploy from a branch", change it to "GitHub Actions" in:
Repository Settings > Pages > Source > GitHub Actions
