[![Run Tests](https://github.com/walk-through/specifier/actions/workflows/test.yml/badge.svg)](https://github.com/walk-through/specifier/actions?query=workflow%3A%22Run%20Tests%22)

# Specifier

## Deploy

Just push to master and the github action will build into the `gh-pages` branch.

Make sure you have Pages enabled on your repository pointing at `gh-pages` branch from `/` root.

## Local development

Make sure node is installed and updated, then after cloning and cding into the project:

```
npm install
npm run dev
```

Vite should handle automatically re-serving files as they change.

## TODO (leftover from template)

Look for instances of "Vite App" and "vite-template" to rename to something more appropriate.

Also as per the note, fix the test build badge at the top of the README to point to the new user/repo.
