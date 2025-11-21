# WhatsApp Sticker Gallery

A simple static, local website to browse, preview and download stickers (PNG/JPG).

How it works
- The site is entirely client-side (no backend).
- Edit `assets/js/stickers-data.js` to list your sticker files and metadata.
- Place your sticker image files next to `index.html` (in the same folder).

Files created
- `index.html` — main page
- `assets/css/styles.css` — styles
- `assets/js/stickers-data.js` — edit this to add your sticker filenames/names/tags
- `assets/js/app.js` — gallery logic (search, modal, download)

Usage
1. Put your sticker images (PNG/JPG) in the same folder as `index.html`.
2. Open `assets/js/stickers-data.js` and replace the sample entries with your filenames. Example:

   { file: 'mysticker.png', name: 'My Sticker', tags: ['meme','fun'] }

3. Open `index.html` in your browser. For the best experience, serve files with a local static server (optional):

PowerShell (recommended):

```powershell
# from the folder that contains index.html
python -m http.server 8000; Start-Process "http://localhost:8000"
```

Or simply double-click `index.html` to open directly in the browser.

Want me to auto-generate `assets/js/stickers-data.js` from the actual filenames in this folder? I can scan the folder and build the array for you — say the word and I'll do it.
