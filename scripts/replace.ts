#!/usr/bin/env ts-node

const fs = require('fs');
const path = require('path');

interface Mapping {
  find: string;
  replace: string;
}

interface MappingGroup {
  mappings: Mapping[];
}

// Only process these file extensions
const FILE_EXTENSIONS = ['.tsx', '.ts', '.js', '.html', '.css'];

// Load and parse mappings from the mappings file
function loadMappings(mappingsPath: string): MappingGroup[] {
  try {
    const content = fs.readFileSync(mappingsPath, 'utf8');
    const lines = content.split('\n');
    let mappingGroups: MappingGroup[] = [];
    let currentGroup: Mapping[] = [];
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === '') {
        if (currentGroup.length > 0) {
          mappingGroups.push({ mappings: currentGroup });
          currentGroup = [];
        }
      } else if (trimmedLine.includes('=')) {
        const [find, replace] = trimmedLine.split('=');
        if (find && replace !== undefined) {
          currentGroup.push({
            find: find.trim(),
            replace: replace.trim(),
          });
        }
      }
    }
    if (currentGroup.length > 0) {
      mappingGroups.push({ mappings: currentGroup });
    }
    console.log(`Loaded ${mappingGroups.length} mapping groups`);
    return mappingGroups;
  } catch (error) {
    console.error(`Error loading mappings from ${mappingsPath}:`, error);
    process.exit(1);
  }
}

// Process a single line, applying one replacement per group
function processLine(line: string, mappingGroups: MappingGroup[]): string {
  let processedLine = line;

  // Characters that can follow a match
  const boundaryChars = ' "\';,)]}<>';
  // Escape for use inside a character class
  const boundaryClass = boundaryChars.replace(/([\\\]\-])/g, '\\$1');

  for (const group of mappingGroups) {
    // Sort mappings by length (longest first)
    const sortedMappings = [...group.mappings].sort(
      (a, b) => b.find.length - a.find.length
    );

    for (const mapping of sortedMappings) {
      // Escape regex special characters in the find string
      const escapedFind = mapping.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Regex: match only if followed by a boundary char or end of line
      const regexPattern = new RegExp(
        `${escapedFind}(?=[${boundaryClass}]|$)`,
        'g'
      );
      // Debug: Uncomment to see regex and matches
      // console.log(`Regex for '${mapping.find}':`, regexPattern);
      // console.log('Matches:', processedLine.match(regexPattern));
      if (regexPattern.test(processedLine)) {
        processedLine = processedLine.replace(regexPattern, mapping.replace);
        break; // Only apply one replacement per group
      }
    }
  }

  return processedLine;
}

// Process a single file
function processFile(filePath: string, mappingGroups: MappingGroup[]): void {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const processedLines: string[] = [];
    for (const line of lines) {
      const processedLine = processLine(line, mappingGroups);
      processedLines.push(processedLine);
    }
    const newContent = processedLines.join('\n');
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✓ Processed: ${filePath}`);
    } else {
      console.log(`- No changes: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Process a directory recursively
function processDirectory(
  dirPath: string,
  mappingGroups: MappingGroup[]
): void {
  try {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        processDirectory(fullPath, mappingGroups);
      } else if (stat.isFile()) {
        if (FILE_EXTENSIONS.some((ext) => fullPath.endsWith(ext))) {
          processFile(fullPath, mappingGroups);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

// Process files and/or directories
function processTargets(
  targets: string[],
  mappingGroups: MappingGroup[]
): void {
  for (const target of targets) {
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      console.log(`Processing directory: ${target}`);
      processDirectory(target, mappingGroups);
    } else if (stat.isFile()) {
      if (FILE_EXTENSIONS.some((ext) => target.endsWith(ext))) {
        console.log(`Processing file: ${target}`);
        processFile(target, mappingGroups);
      } else {
        console.log(`- Skipped (unsupported extension): ${target}`);
      }
    } else {
      console.error(`Target is neither file nor directory: ${target}`);
    }
  }
}

// CLI interface
function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
Usage: ./scripts/replace.ts <targets...> [options]

Arguments:
  targets              Files or directories to process

Options:
  --mappings, -m <path>    Path to mappings file (default: scripts/mappings.txt)

Examples:
  ./scripts/replace.ts file1.css file2.tsx
  ./scripts/replace.ts src/
`);
    process.exit(1);
  }
  let mappingsPath = 'scripts/mappings.txt';
  // Parse options
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--mappings' || args[i] === '-m') && i + 1 < args.length) {
      mappingsPath = args[i + 1];
      args.splice(i, 2);
      i--;
    }
  }
  const targets = args;
  if (targets.length === 0) {
    console.error('No targets specified');
    process.exit(1);
  }
  console.log(`Using mappings file: ${mappingsPath}`);
  console.log(`File extensions: ${FILE_EXTENSIONS.join(', ')}`);
  console.log(`Targets: ${targets.join(', ')}`);
  console.log('');
  const mappingGroups = loadMappings(mappingsPath);
  processTargets(targets, mappingGroups);
  console.log('\nProcessing complete!');
}

if (require.main === module) {
  main();
}
