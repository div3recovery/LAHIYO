# Lahiyo – Digital Office Assistant

Installable web app for the Office of the Joint Commissioner of State Tax, Division-3, Gandhinagar.
This folder is the front end (GitHub Pages). The work is done by the Lahiyo Apps Script project and its Google Sheet.

## Files
| File | Purpose |
|---|---|
| `index.html` | The app |
| `config.js` | **Paste your Apps Script Web app URL here** |
| `lahiyo-api.js` | Connects the app to Apps Script |
| `manifest.webmanifest`, `sw.js`, `icons/` | Make the app installable |

## Setup
1. Apps Script: add `Api.gs`, then Deploy → Manage deployments → ✏️ → Who has access: **Anyone** → New version → Deploy. Copy the Web app URL (ends in `/exec`).
2. Paste that URL into `config.js` between the quotes.
3. Upload all files and the `icons` folder to a GitHub repository.
4. Repository → Settings → Pages → Deploy from a branch → `main` / root → Save.
5. Open `https://<your-username>.github.io/<repository>/`, sign in with a branch PIN, then Chrome menu → Install.

No passwords, PINs or API keys are stored in these files. The Gemini key stays in Apps Script.
