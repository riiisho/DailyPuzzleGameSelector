# DailyPuzzleGameSelector

A lightweight static web app that picks a random puzzle game with a short animation.

## Features

- Randomize button with animated game selection
- Game list loaded from `games.json`
- Fallback list if JSON loading fails
- Works as a static site (ideal for GitHub Pages)

## Edit Game List

Update `games.json` with objects in this format:

```json
{
	"name": "Game Name",
	"url": "https://example.com"
}
```

## Run Locally

Open `index.html` in a browser, or use any simple static server.

## Deploy To GitHub Pages

1. Push this repository to GitHub.
2. Go to repository **Settings** -> **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder.
5. Save and wait for deployment.

Your site will be available at:

`https://<your-username>.github.io/<your-repo-name>/`