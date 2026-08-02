# Santtu Nurmi's Portfolio

Personal portfolio website for Santtu Nurmi: project-first software developer and technical problem-solver.

Live: [Netlify](https://santtunurmi.netlify.app/) | [GitHub Pages](https://santtunurmi.github.io/)

## History

- **V1.0 (archived major branch):** Hand-built with HTML, CSS, and JavaScript. V1.0 was built without AI.
- **V2.0 (archived major branch):** Rebuilt as a Bootstrap and Sass multi-page site.
- **V3:** The current Vite, React, and TypeScript single-page application.

## Current Stack

- Vite, React, and TypeScript
- Bootstrap and Sass
- React Router and Motion

## Local Development

Requires Node.js 24 and npm 11.

```bash
npm ci
npm run dev
npm run test
npm run build
npm run verify
```

`npm run verify` runs linting, type checking, automated tests, and the production build. The build writes the deployable static site to `docs/`, including static route entries for GitHub Pages.

## Deployment

The generated `docs/` directory is the GitHub Pages deployment artifact. The site can also be deployed to Netlify using the production build command (`npm run build`) and `docs/` as the publish directory.

## AI-Assisted V3 Workflow

V3 uses an AI-assisted, human-reviewed workflow for exploration, implementation, review, and documentation. AI is not a substitute for judgment: Santtu keeps responsibility for context, direction, testing, and final decisions.
