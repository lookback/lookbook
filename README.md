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
<link rel="stylesheet" href="<CDNPATH>/<version>/lookbook.dist.css" />
```

This CSS file is cached with `immutable, max-age: 31536000`.

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

## To do

- [x] Color scheme
- [x] Proper installation and distribution options
- [ ] Hosting on CDN
- [ ] Docs
