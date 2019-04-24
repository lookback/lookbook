# The Lookbook 💅

[![](https://img.shields.io/circleci/token/72b49f88c10f93d0d86ff25d730453d300d10671/project/github/lookback/lookbook/master.svg?style=flat-square)](https://circleci.com/gh/lookback/lookbook)

Lookback's central location for shared colors and styles ✨

## Usage

You can make use of the Lookbook styles depending on what your needs are. There are three use cases:

1. You just need the basic Lookbook base styling and helpers in a big ol' CSS file.
2. You'd like to use the Lookbook's config variables in your custom stylesheet.
3. Both of 1) and 2).

### 1. Just the stylesheet

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

### 2. Custom use with PostCSS

If you'd like to use the variables in your custom CSS, you can install this Lookbook as an npm module and use its exported `postCssConfig` in a PostCSS setup:

```js
import { postCssConfig } from 'lookbook';

const compileCss = () =>
  gulp
    .src('src/stylesheets/*.css')
    .pipe(postcss(postCssConfig.plugins))
    .pipe(gulp.dest('./dist'));

gulp.task('css', () => compileCss());
```

It's now possible to use all variables inside your custom stylesheet, as well as `@apply` directives.

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

## Developing

To hack on the CSS in this repo, remember these things:

1. Your seemingly tiny changes might have huge rings on the water. Like the wings of your butterfly. This CSS might be used in many web products of Lookback. Be sure to _test_ your changes. Even if consumers of this CSS use versioning.
2. Keep it simple. This CSS should _only_ use the bare minimum to get started when styling a web frontend. Don't add extra kilobytes in vain.

With that said, here are some nifty scripts that might aid development:

### `npm run build`

This builds the final distributable CSS files:

- `dist/lookbook.dist.css` – The minified file, including an inline source map.
- `dist/lookbook.css` – Unminified file, meant for development or inclusion in other CSS codebases.

### `npm run watch`

Compile the distributable CSS files as you save.

### `scripts/release`

This one is handy when you wanna release a new version of the Lookbook's CSS. The script will accept a version number, like `2.0.1`. _Do not_ prefix with a `v` or similar. Just the number, please.

**Pre-condition:** Bump the `version` field in `package.json`, please.

The script will:

1. Run `build` to build the CSS.
2. Run `npm install` to get a new version in `package-lock.json`.
3. Add and commit the files above.
4. Tag the commit with the version number entered.
5. Push the commit and tag to the GitHub repo.
6. Distribute the `dist/lookbook.dist.css` file to the S3 bucket and CDN.
7. 💥

### `scripts/fetch-figma-colors`

When editing the colour scheme, currently kept as a shared library in Figma, you can use this script to update the Tailwind config with all those colours. We use Figma's nifty web API for that.

### `npm test`

Currently lints the CSS source.

### `scripts/distribute`

Uploads the `dist/lookbook.dist.css` to an S3 bucket.

⚠️ You need to bump the `version` field in `package.json` to distribute a new version to S3!

The script will exit if an existing version exists on S3. These releases are immutable, since we cache them really hard.

See `scripts/release` above for a full release process.

## To do

- [x] Color scheme
- [x] Proper installation and distribution options
- [x] Hosting on CDN
- [ ] Docs
