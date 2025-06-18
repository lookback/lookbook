/// <reference types="@figma/plugin-typings" />
/// <reference types="@figma/plugin-typings/plugin-api.d.ts" />
//
// Exports Figma Variables as JSON and trigger a file download
//

getFigmaVariablesJSON().then((json) => figma.ui.postMessage(json));

async function getFigmaVariablesJSON() {
  const variables = await figma.variables.getLocalVariablesAsync();
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  const out = await processVariables(variables, collections);

  return JSON.stringify(out, null, 2);
}

/**
 * @param {Variable[]} variables
 * @param {VariableCollection[]} collections
 */
async function processVariables(variables, collections) {
  /** @type {Record<string, VariableCollection>} */
  const collectionDict = Object.assign(
    ...collections.map((c) => ({ [c.id]: c }))
  );

  const ret = Object.assign(...collections.map((c) => ({ [c.name]: [] })));

  for (const v of variables) {
    if (v.hiddenFromPublishing) {
      console.log(`Skipping ${v.name} as it's hiddenFromPublishing`);
      continue;
    }

    // Guaranteed to exist
    const coll = collectionDict[v.variableCollectionId];

    const tok = await tokenOf(v);

    ret[coll.name].push(tok);
  }

  return ret;
}

/**
 * @param {Variable} v
 */
async function tokenOf(v) {
  const res = await transformValue(v);

  return {
    name: nameOf(v),
    value: res.value,
    target: res.target,
    description: v.description || null,
  };
}

/**
 * @param {Variable} v
 */
function nameOf(v) {
  const groups = v.name.split('/');
  const parentGroup = groups[groups.length - 2];
  const name = groups[groups.length - 1];

  if (name == null) {
    throw new Error(`Couldn't make good name for: ${v.name}`);
  }

  // Colors are special. We want them to be `--color-{name}` to suit Tailwind's config, but it's just
  // clutter in Figma.
  return parentGroup == 'color' ? `color-${name}` : name;
}

/**
 * @param {Variable} v
 */
async function transformValue(v) {
  const value = findValue(v.valuesByMode);

  // If the value is a variable alias, we need to follow the reference to its target (and maybe the target's target :)).
  if (value.type == 'VARIABLE_ALIAS') {
    const target = await figma.variables.getVariableByIdAsync(value.id);

    if (!target) {
      throw new Error(
        `Couldn't lookup target variable from alias: ${v.name} id: ${value.id}`
      );
    }

    return {
      value: await transformValue(target).then((t) => t.value),
      target: nameOf(target),
    };
  }

  return {
    value: valueOf(v, value),
    target: null,
  };
}

/**
 * @param {Variable} v
 * @param {VariableValue} value
 */
function valueOf(v, value) {
  switch (v.resolvedType) {
    case 'COLOR':
      return rgbaToLch(value);
    case 'FLOAT': {
      return parseFloat(value.toFixed(3));
    }
    case 'BOOLEAN':
    case 'STRING':
      return value;
  }
}

/**
 * @param {Record<string, VariableValue>} values
 */
function findValue(values) {
  return Object.values(values)[0];
}

/**
 * @param {RGBA | RGB} rgba
 */
function rgbaToLch(rgba) {
  const srgbToLinear = (c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const { r, g, b, a: alpha } = rgba;

  // RGB => linear RGB
  const rLin = srgbToLinear(r);
  const gLin = srgbToLinear(g);
  const bLin = srgbToLinear(b);

  // linear RGB => OKLAB
  const l = 0.412165612 * rLin + 0.536275208 * gLin + 0.0514575653 * bLin;
  const m = 0.211859107 * rLin + 0.6807189584 * gLin + 0.107406579 * bLin;
  const s = 0.0883097947 * rLin + 0.2818474174 * gLin + 0.6299787005 * bLin;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // OKLAB => OKLCH
  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  // Handle achromatic colors (when chroma is very close to 0)
  if (C < 0.0001) H = 0;

  return alpha != null && alpha != 1
    ? `oklch(${L} ${C} ${H} / ${alpha})`
    : `oklch(${L} ${C} ${H})`;
}

// Create an invisible UI that triggers the download of the JSON file.
figma.showUI(
  `<html>
    <body>
      <a id="downloadLink" download="figma-variables.json" style="display: none;">download</a>
      <script>
        // Receive JSON data from the main plugin code
        window.onmessage = event => {
          const json = event.data.pluginMessage;
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.getElementById('downloadLink');
          link.href = url;
          link.click();
          parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
        };
      </script>
    </body>
  </html>`,
  { visible: false, width: 0, height: 0 }
);

// Listen for the close signal from the UI and close the plugin
figma.ui.onmessage = (msg) => {
  if (msg.type == 'close-plugin') {
    figma.closePlugin();
  }
};
