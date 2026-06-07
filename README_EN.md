# World Cup Forecast Lab 2026

World Cup Forecast Lab 2026 is a static browser-based forecasting dashboard for football fans, creators, bloggers, and analysts.

It runs locally by opening `index.html`. No server, install step, login, or database is required.

## What is included

- Single-match win/draw/loss forecast
- Expected goals and recommended scorelines
- Upset-risk explanation
- Tactical matchup view
- 2026 group overview
- Group-stage table projection
- Key matches and upset watch
- Team detail report
- 32-team knockout bracket projection
- Monte Carlo advancement probabilities
- Data credibility panel
- Exportable text forecast report
- Editable JSON data model
- Chinese / English language toggle
- Semi-automatic data update script

## How to use

1. Open `index.html` in a modern browser.
2. Pick Team A and Team B in the single-match panel.
3. Review the projected score, xG, probabilities, tactical factors, and upset notes.
4. Use the group selector to inspect each group.
5. Open any team badge to view a team report.
6. Use the Monte Carlo section to sort teams by champion probability, Round of 32 probability, or dark-horse potential.
7. Click `Export Forecast Report` to download a text report.

## Data notes

The project separates real tournament data from model-estimated inputs.

Real / structured data:

- 2026 group structure
- 48-team format
- Round of 32 qualification format
- Group-stage fixture table included in the local data file
- Knockout bracket slot structure

Model-estimated inputs:

- Elo-style strength
- Attack and defense ratings
- Form
- Injury impact
- Travel fatigue
- Climate fit
- Market-odds calibration
- Goalkeeper, set-piece, squad-depth, and coaching factors

The model is for fan analysis and content creation. It is not official, and it is not betting advice.

## Data updates

This is a static offline web app. It does not automatically fetch live FIFA rankings, odds, injuries, results, or news.

For safer commercial use, the package includes a semi-automatic update workflow:

1. Copy `data-updates/update-template.json` to a dated file, for example:

   `data-updates/2026-06-10.json`

2. Edit the fields you want to update, such as `fifaRanks`, `teamOverrides`, `fixtures`, `rankingDate`, or `oddsDate`.

3. Run:

```bash
node scripts/update-data.js data-updates/2026-06-10.json
```

The script merges the update into `data/worldcup-data.js`.

It accepts common English team names such as `France`, `Brazil`, `United States`, and `DR Congo`, then maps them to the internal team names used by the app.

This workflow is more stable than scraping third-party sites and is suitable for curated update packs.

## Files

- `index.html` - main app
- `styles.css` - app styling
- `app.js` - forecast model and UI logic
- `data/worldcup-data.js` - tournament data and model parameters
- `README.md` - Chinese usage notes
- `README_EN.md` - English usage notes
- `DISCLAIMER.md` - usage and risk disclaimer
- `data-updates/` - update templates and update workflow notes
- `scripts/update-data.js` - semi-automatic data merge script
- `sales/` - product listing, launch copy, and support templates

## Recommended positioning

Use this as:

- A fan analysis tool
- A football content research assistant
- A World Cup prediction dashboard
- A reporting tool for creators, blogs, newsletters, and social posts

Do not market it as:

- Guaranteed betting picks
- Financial advice
- A way to beat sportsbooks
- Official FIFA analysis
