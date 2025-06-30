const getColorNames = (colors) => Object.keys(colors).map((c) => `'${c}'`);

/**
  Generate Typescript types from a hash of color names and hex codes.

  @param colors A key-value object containing color names as keys and
  hex codes as values
*/
const writeColorTypes = (input) => {
  let json;
  try {
    json = JSON.parse(input);
  } catch (err) {
    console.error('Invalid JSON input.', err);
    process.exit(1);
  }

  // An array like ['orange-10', 'orange-20', ...]
  const colorNames = getColorNames(json);

  const typescript = `declare module '@lookback/lookbook' {

  /** Lookback's color palette. */
  export type Color = ${colorNames.join(' | ')};

  /** A concrete dictionary of colors exported by the Lookbook module. */
  export const colors: {
    [key in Color]: string;
  };
}
`;

  console.log(typescript);
};

let inputString = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  inputString += chunk;
});

process.stdin.on('end', () => {
  writeColorTypes(inputString);
});

if (process.stdin.isTTY) {
  console.error('No input provided');
  process.exit(1);
}
