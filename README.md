[![Run Tests](https://github.com/jcwilk/vite-typescript-react-pages-template/actions/workflows/test.yml/badge.svg)](https://github.com/jcwilk/vite-typescript-react-pages-template/actions?query=workflow%3A%22Run%20Tests%22)
(Fix this badge after forking from template ^)

# React + TypeScript + Vite + Vitest + Github Pages

## vite-github-pages-template

A just-enough template for throwing javascript into github pages

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

## After building a repo from the template

Look for instances of "Vite App" and "vite-template" to rename to something more appropriate.

Also as per the note, fix the test build badge at the top of the README to point to the new user/repo.

# Original README below from the vite template left for convenience

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
