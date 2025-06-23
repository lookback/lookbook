const fs = require('fs');
const path = require('path');

//
// Read Figma variables and build a colors JSON object to be distributed.
//

/**
 * Converts an RGBA color object to HEX.
 * Assumes r, g, b, (and a if present) are in 0–1 range.
 * If alpha is 1 (or missing) the output is in "#rrggbb" form.
 * Otherwise, outputs "#rrggbbaa".
 */
function rgbaToHex({ r, g, b, a }) {
  const to255 = (c) => Math.round(c * 255);
  const hex = (c) => to255(c).toString(16).padStart(2, '0');

  // If a is missing or 1, ignore alpha.
  if (a === undefined || a >= 1) {
    return '#' + hex(r) + hex(g) + hex(b);
  } else {
    return '#' + hex(r) + hex(g) + hex(b) + hex(a);
  }
}

/**
 * Recursively walk an object (or array) and extract
 * all entries whose "name" starts with "color-".
 * The extracted colors are added to the provided result object.
 */
function extractColors(obj, result) {
  if (Array.isArray(obj)) {
    obj.forEach((item) => extractColors(item, result));
  } else if (typeof obj === 'object' && obj !== null) {
    if (
      obj.name &&
      typeof obj.name === 'string' &&
      obj.type == 'COLOR' &&
      obj.value &&
      typeof obj.value === 'object'
    ) {
      const key = obj.name;
      result[key] = rgbaToHex(obj.value);
    }
    // Recursively check all properties.
    Object.values(obj).forEach((val) => extractColors(val, result));
  }
}

function buildColors(input) {
  let figmaVariables;
  try {
    figmaVariables = JSON.parse(input);
  } catch (err) {
    console.error('Invalid JSON input.', err);
    process.exit(1);
  }

  const colors = {};

  extractColors(figmaVariables.primitives, colors);

  console.log(JSON.stringify(colors, null, 2));
}

let inputString = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  inputString += chunk;
});

process.stdin.on('end', () => {
  buildColors(inputString);
});

if (process.stdin.isTTY) {
  console.error(
    'No input provided. Please pipe the Figma JSON to this script.'
  );
  process.exit(1);
}
