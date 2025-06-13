A Figma plugin for exporting Variables into JSON for the Lookbook. This is a workaround because the endpoint for fetching the variables via the Figma REST API is behind a pricey plan.

## Dev

```bash
npm install
```

## Usage

1. Load the plugin in Figma via the `Plugins -> Development -> Import plugin from manifest…` menu. Pick the `manifest.json` in this directory.
2. Open the [Design System](https://www.figma.com/design/1MVapBNE9WPwEqYvahvYCJ/Design-System) file in Figma.
3. Run the plugin from the same menu: `Plugins -> Development -> Lookback Export Variables`.
4. Save the JSON file from the file prompt to `./tokens.json` in this repo.
5. After verifying the CSS changes from the design tokens in the JSON, check the changes into git.
