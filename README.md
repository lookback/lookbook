# The Lookbook 💅

[![CircleCI](https://img.shields.io/circleci/build/github/lookback/lookbook?style=flat)](https://app.circleci.com/pipelines/github/lookback/lookbook?branch=main)

Lookback's central location for shared colors and styles ✨ This repository is a build chain for building a distributable `.css` file for use in various web products of Lookback.

- [Test bed site](https://lookback.github.io/lookbook-website/).
- [Figma design system](https://www.figma.com/design/1MVapBNE9WPwEqYvahvYCJ/Design-System?node-id=405-151&p=f&t=syfRRAjNOEOEl23I-11).

## Usage

1. Install dependencies:

```bash
npm install --save @lookback/lookbook tailwindcss @tailwindcss/postcss postcss postcss-cli
```

2. Set up the PostCSS config:

```js
// postcss.config.js
const lookbook = require('@lookback/lookbook');

module.exports = {
  plugins: [
    //
    ...lookbook.foundation({ bundle: !!process.env.BUNDLE }),
  ],
};
```

3. Add to the main app CSS entry point:

```css
/* src/input.css */

@import '@lookback/lookbook/dist/lookbook.css';

@import './your-app.css' layer(app);
```

4. Build the CSS:

```bash
postcss src/input.css --dir build --verbose
```

## Releasing new versions

We use npm to publish new versions of the Lookbook package. To release a new version, follow these steps:

1. Bump the version with `npm version <new-version>`.
    - **Note:** this will run `npm run build && git add dist` so that the built CSS (with a new header comment with the new version) is included in the tagged version commit. This is usually not a problem, since `npm version` refuses to run if you have a dirty working directory.
2. `npm publish && git push origin && git push --tags origin`.

## Generating design tokens from Figma

This repo includes a Figma plugin to generate the design tokens from our design system file. We store design tokens as Figma "variables".

### First time: Setting up the plugin in Figma

1. `Plugins -> Development -> Import plugin from manifest…`.
2. Browse into this repo for `figma/export-variables/manifest.json`.

### Generating the tokens

1. `Plugins -> Development -> Lookback Export Variables`.
2. Save into this repo as `gen/figma-variables.json`. Replace existing.
3. Done. Inspect the diff.

## Dev

Run:

```bash
npm start
```

to continously build `dist/lookbook.css` based on changes in the CSS in `src` as well as the generated tokens in `gen/figma-variables.json`.
