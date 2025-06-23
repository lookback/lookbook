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
    type: v.resolvedType,
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
    value,
    target: null,
  };
}

/**
 * @param {Record<string, VariableValue>} values
 */
function findValue(values) {
  return Object.values(values)[0];
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
