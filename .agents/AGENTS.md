# Project Rules

- **Git Workflow for Deployment**: This project is deployed online. Whenever visual or functional changes are made (e.g., CSS updates, component changes), you MUST commit and `git push` the changes to the `main` branch so that the live site (Vercel/Netlify) can build and reflect the updates.
- **Hashtag Parsing**: Hashtags in this project are parsed by splitting strings by `#`, NOT by space. This allows hashtags to contain spaces (e.g., `#교직원 회의`). Do not change this logic back to space-based splitting.
- **Compact UI Layout**: The main page uses a compact CSS layout (`page.module.css`). Keep padding, margins, and gaps small (e.g., `gap: 1.5rem`, `padding: 1.5rem` for cards) so that the first row of web apps can fit cleanly on the screen without being pushed below the fold.
