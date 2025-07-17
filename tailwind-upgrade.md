# Tailwind upgrades

## Tailwind v2 -> v3

To do:

* `bg-black bg-opacity-50` -> `bg-black/50`
* `overflow-clip` -> `text-clip`
* `overflow-ellipsis` -> `text-ellipsis`
* `flex-grow-*` -> `grow-*`.
* `flex-shrink-*` -> `shrink-*`.

## Tailwind v3 -> v4

To do:

* Run `npx @tailwindcss/upgrade`?
* Define all theme variables as CSS vars on `@theme`. This will also generate util classes. All defaults: https://tailwindcss.com/docs/theme#default-theme-variable-reference.
* Probably want to remove some or all default TW namespaces, like color, with this syntax:

   ```css
   @theme {
       --color-*: initial;
       --color-red-500: #f87171; /* Our own red-500 */
   }
   ```
   To nuke all:
   
   ```css
   @theme {
       --*: initial;
   }
   ```

* Use `var(--<conf>-<variable>)` over `theme('conf.value')`. Like `var(--color-red-500)` over `theme('colors.red-500')`.

### Grep for existing use of Lookbook variables

These are "global" `variables.css` from the Lookbook.
```css
:root {
  --font-sans-serif: theme('fontFamily.sans');
  --font-mono: theme('fontFamily.mono');

  --base-font: var(--font-sans-serif);
  /** Base measurement. Is set as root font size on <body>. */
  --base-size: theme('baseSize');
  /** Main vertical rhythm unit. Set as line-height on <body>. */
  --base-leading: theme('baseLeading');

  --background-color: theme('backgroundColor.body');
  --text-color: theme('textColor.body');
  --text-muted: theme('textColor.muted');
  --heading-color: var(--blue-80);
  /** Default box shadow. This is grey-100 */
  --shadow-color: 63 58 51;

  --selection-background: var(--blue-80);
  --selection-color: #fff;
  --placeholder-color: theme('textColor.muted');
  --accent-color: var(--blue-80);
  --ring-color: var(--blue-50);

  /** Sets the default padding for controls like buttons and form inputs. */
  --control-padding: 0.5em 1em;

  /* <a> */
  --link-color: var(--blue-60);
  --link-color-hover: var(--blue-70);
}
```

### Custom Lookbook utils removals

* `.square` -> `.aspect-square`
* `.break-text` -> `.wrap-anywhere`

## v3/v4 problem

v3 introduced "JIT mode", which builds the CSS on demand, rather than at build time. It's fundamentally incompatible with our current architecture of prebuilding a CSS bundle in the Lookbook and distributing it to the apps.

**Solution:**

* Let apps depend on Tailwind directly.
* Have shared config in the Lookbook.
* Import shared config into the apps's `tailwind.config.js`.
* Stop building the CSS bundle in the Lookbook. Instead, expose any custom CSS (variables, classes) in the Lookbook as a separate file, which the apps can import.

In each app:

```bash
npm i --save-dev tailwindcss@latest @tailwindcss/postcss@latest
```

In `postcss.config.mjs`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  }
}
```

Somewhere in the CSS:

```css
@import "tailwindcss";
```

Build.

## Nice to have

* Move CSS font definition of Inter to Lookbook. Right now, it's in all the apps.
