# Santtu Nurmi's Portfolio

A self-started web project that grew from a hand-built HTML/CSS/JavaScript SPA into a Vite, React, and TypeScript application.

Externally hosted on Netlify: [https://santtunurmi.netlify.app/](https://santtunurmi.netlify.app/) | GitHub pages: [https://santtunurmi.github.io/](https://santtunurmi.github.io/)

## History

- **V1.0 (archived major branch):** Hand-built single-page application with HTML, CSS, and JavaScript. Built without AI.
- **V2.0 (archived major branch):** V1.0 rebuilt as a Bootstrap and Sass multi-page site. Built without AI.
- **V3:** V2.0 migrated to Vite, React, and TypeScript single-page application to leverage better interactability, animations and modularity. Built using AI-assisted workflows.

## Current Stack

- Vite, React, and TypeScript
- Bootstrap and Sass
- React Router and Motion

## AI-Assisted V3 Workflow

Used a stack of OpenClaw, ChatGPT, Claude Code and OpenCode to maintain a produciton environment which could tackle V3.0 migration, animation implementation and module code-work, while maintaining my original writing and content direction. I maintained project control, audited changes and coded manually on specific occasions.

## Local Testing

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

The generated `docs/` directory is the GitHub Pages deployment artifact. The site is deployed to Netlify using the production build command (`npm run build`) and `docs/` as the publish directory.