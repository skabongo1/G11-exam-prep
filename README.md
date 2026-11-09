# G11 Exam Prep

Independent study app for the ICC G11 General Building Contractor (A) exam. Not affiliated with or endorsed by the International Code Council. Practice questions are original; code references point to the 2018 International Building Code (first printing) and the Concrete Manual (2021 IBC / ACI 318-19 edition), without reproducing the books.

## What's inside

- Course lessons (Modules A, B and C), rule sheets for all 16 outline subtopics, branching scenarios, lookup trainer, flashcards.
- Practice exams: Mock Exams 1–3 plus unlimited 90-question exam series at the official weights (19 / 31 / 42 / 8) with the 4-hour clock.
- **My code books**: open your own PDF copies of the 2018 IBC and the Concrete Manual for page turning, highlighting, tabs, page notes and search. Files stay in the browser on your device (IndexedDB); nothing is uploaded. Uses pdf.js (Apache-2.0, `lib/pdfjs`).
- **Book guides**: open-book method, IBC tab and highlighting plan, Concrete Manual guide, math and plan-reading calculators (merged from the former G11 Class A Academy).

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

`src/` holds the course content (`content*.js`, `toon.js` for the ToonBee Method exam, `series.js`, `scenarios.js`, `guides.js`), the reader (`reader.js`), the app logic (`app.js`) and the page shell (`shell.html`). The build writes `index.html`, `sw.js` and `manifest.webmanifest`.
