# The Lookbook 💅

[![](https://img.shields.io/circleci/token/72b49f88c10f93d0d86ff25d730453d300d10671/project/github/lookback/lookbook/master.svg?style=flat-square)](https://circleci.com/gh/lookback/lookbook)

Lookback's central location for shared colors and styles ✨

Read the complete overview at the [Lookbook website](https://lookback.github.io/lookbook-website/).

## What's included

This repository is a build chain for building a distributable `.css` file for use in various web products of Lookback.

### The CSS file

- CSS Custom Properties for all Lookback colors.
- A CSS reset (Normalize).
- Components, such as loading indicators and buttons.
- Styled HTML elements.
- Utility classes, made with [Tailwind](https://tailwindcss.com/).

#### Build Artefacts

- **`lookbook.css`** – Non-minified. Good for dev or inclusion in other projects through importing the npm module.
- **`lookback.dist.css`** – Minified with sourcemaps. This is probably what you'd like in production.
- **`lookback.bare.css`** – Minified without sourcemaps. When you don't need sourcemaps (gives a smaller build).

All of these files are available in the `dist` directory. This means, you can add this module as a dependency in your project, and then `@import` the CSS file you need:

```css
/* style.css */
@import 'lookbook/dist/lookbook.css';
/* or
 *
 *  @import 'path/to/node_modules/lookbook/dist/lookbook.css';
 *
 * depending on how your local CSS build chain is working with @import
 */
```

### The PostCSS plugin

- Access to all features of Tailwind (including `theme()`, `@apply`, and other functions and directives) in your CSS.
- Nesting
- Color functions (`color(#fff alpha(80%))`).
- `@import`
- Autoprefixer

## Usage

You can make use of the Lookbook styles depending on what your needs are. There are three use cases:

1. You just need the basic Lookbook base styling and helpers in a big ol' CSS file.
2. You'd like to use the Lookbook's config variables in your custom stylesheet.
3. Both of 1) and 2).

### Just the stylesheet

Add a `link` element to a `head` tag:

```html
<link
  rel="stylesheet"
  href="http://d3qrqu421jx10s.cloudfront.net/<version>/lookbook.dist.css"
/>
```

This CSS file is cached with `immutable, max-age: 31536000`.

If you want to be on the bleeding edge, use `latest` as version:

```html
<link
  rel="stylesheet"
  href="http://d3qrqu421jx10s.cloudfront.net/latest/lookbook.dist.css"
/>
```

This should work for most sites. You can of course also link to the `bare` and non-minified versions of `lookbook.css` too.

### Custom use with PostCSS

For more advanced usage, you can use the Lookbook as a regular PostCSS plugin.

If you'd like to use the Tailwind config values in your custom CSS, you can install this Lookbook as an npm module and use its exported `defaultPlugins` function in a PostCSS setup (see "API" below).

Note that you might wanna minify the CSS yourself.

### Programmatic API

These are the exported members of the `lookbook` module.

#### Types

Typescript types are included in `dist/types.d.ts`.

#### `colors`

If you only want the raw colour codes, they're provided as a hash in the `colors` export:

```js
import { colors } from 'lookbook';

console.log(colors);
/*
{
  'orange-10': '#fef7ea',
  'orange-20': '#fef3d7',
  'orange-30': '#f6e1aa',
  'orange-40': '#fcc646',
  ...
*/
```

#### `postCssConfig`

A PostCSS config ready for use in a `postcss.config.js`.

#### `defaultPostCssPlugins`

A function for getting all the PostCSS plugins we use internally in this Lookbook module as an array. This is handy to attach to PostCSS's `plugin` config flag.

A Gulp example:

```js
// gulpfile.js
const { defaultPostCssPlugins } = require('lookbook');
const postcss = require('gulp-postcss');

const compileCss = () =>
    gulp
        .src('src/stylesheets/*.css')
        .pipe(
            postcss(
                // `defaultPostCssPlugins` returns an array of plugins.
                ...require('lookbook').defaultPostCssPlugins({
                    // Optionally refer to your own tailwind config:
                    pathToTailwindConf: './tailwind.config.js',
                })
                someOtherPlugin(),
            )
        )
        .pipe(gulp.dest('./dist'));

gulp.task('css', () => compileCss());
```

Optionally, call the function with a hash where you refer to a local `tailwind.config.js`. In there, you can extend the default one we keep in the Lookbook (this is of course not encouraged).

#### `tailwindConfig`

Lookback's [Tailwind config](https://tailwindcss.com/docs/configuration).

## Developing

To hack on the CSS in this repo, remember these things:

1. Your seemingly tiny changes might have huge rings on the water. Like the wings of your butterfly. This CSS might be used in many web products of Lookback. Be sure to _test_ your changes. Even if consumers of this CSS use versioning.
2. Keep it simple. This CSS should _only_ use the bare minimum to get started when styling a web frontend. Don't add extra kilobytes in vain.

With that said, here are some nifty scripts that might aid development:

### `npm run build`

This builds the final distributable CSS files:

- `dist/lookbook.dist.css` – Minified CSS, including source maps.
- `dist/lookbook.css` – Unminified file, meant for development or inclusion in other CSS codebases.
- `dist/lookbook.bare.css` – Minified CSS.

### `npm run watch`

Compile the distributable CSS files as you save.

### `npm run release`

This one is handy when you wanna release a new version of the Lookbook's CSS.

**Pre-condition:** Bump the `version` field in `package.json`, please.

The script will:

1. Run `npm install` to get a new version in `package-lock.json`.
2. Run `build` to build the CSS.
3. Run `npm test` to test the CSS.
4. Add and commit the files above.
5. Tag the commit with the version number entered.
6. Push the commit and tag to the GitHub repo.
7. Distribute the built files in `dist` to the S3 bucket and CDN. See `scripts/distribute` below.
8. 💥

### `scripts/fetch-figma-colors`

When editing the colour scheme, currently kept as a shared library in Figma, you can use this script to update the Tailwind config with all those colours. We use Figma's nifty web API for that.

### `npm test`

Currently lints the CSS source.

### `scripts/distribute`

Uploads the CSS files from `dist` to an S3 bucket.

⚠️ You need to bump the `version` field in `package.json` to distribute a new version to S3!

The script will exit if an existing version exists on S3. These releases are immutable, since we cache them really hard.

See `scripts/release` above for a full release process.
