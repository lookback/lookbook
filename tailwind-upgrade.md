# Tailwind upgrades

## Tailwind v2 -> v3

To do:

* `bg-black bg-opacity-50` -> `bg-black/50`
* `overflow-clip` -> `text-clip`
* `overflow-ellipsis` -> `text-ellipsis`
* `flex-grow-*` -> `grow-*`.
* `flex-shrink-*` -> `shrink-*`.

## v3/v4 problem

v3 introduced "JIT mode", which builds the CSS on demand, rather than at build time. It's fundamentally incompatible with our current architecture of prebuilding a CSS bundle in the Lookbook and distributing it to the apps.

**Solution:**

* Let apps depend on Tailwind directly.
* Have shared config in the Lookbook.
* Import shared config into the apps's `tailwind.config.js`.
* Stop building the CSS bundle in the Lookbook. Instead, expose any custom CSS (variables, classes) in the Lookbook as a separate file, which the apps can import.
