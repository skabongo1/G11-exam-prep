# G11 Exam Prep

Independent study app for the ICC G11 General Building Contractor (A) exam. Not affiliated with or endorsed by the International Code Council. Practice questions are original; code references point to the 2018 International Building Code, first printing, without reproducing code text.

## Install on your phone

**iPhone (Safari):** open the site → tap **Share** → **Add to Home Screen** → **Add**.
**Android (Chrome):** open the site → tap **Install app** when offered, or **⋮ → Add to Home screen / Install app**.

The app works offline after the first visit. Progress is saved on the phone; use **Data & settings → Export** to back it up or move it to another device.

## Updates

Each build gets a new version number. When an update is published, the app shows **"A new version of G11 Exam Prep is ready"**; tap **Update now**. Progress is kept.

## Building

```
python3 build.py src
```

`src/` holds the course content (`content*.js`, `series.js`, `scenarios.js`), the app logic (`app.js`) and the page shell (`shell.html`). The build writes `index.html`, `sw.js` and `manifest.webmanifest`.
