# Online Demo Data Updates

`latest.json` is the update file used by GitHub Actions.

The current setup is an automatic update pipeline, not a live sports data scraper.

## How it works

1. Edit `data-updates/latest.json`.
2. GitHub Actions runs `scripts/update-data.js`.
3. If `data/worldcup-data.js` changes, the action commits the update.
4. GitHub Pages refreshes the online demo.

## Manual run

In GitHub:

`Actions` -> `Update forecast data` -> `Run workflow`

## Scheduled run

The workflow also runs once per day.

## Important

Keep this as a curated update workflow unless you connect a reliable licensed data source.

