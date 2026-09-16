# Known Limitations & Issues

### Testing
- **No Automated Tests:** The test suite is currently empty and relies on manual validation. Jest and React Testing Library should be implemented.

### Media Handling
- **No Image Resizing:** The `/api/upload` route streams the raw image buffer directly to Supabase. Large files (e.g., 5MB JPEGs) are not compressed, which can hurt frontend performance on mobile networks. 
- *Suggested Fix:* Implement `sharp.js` in the Multer middleware to resize images to WebP formats before uploading to Supabase.

### Security
- **Static API Key:** The system uses a single master key instead of per-user JWTs, making revocation difficult.