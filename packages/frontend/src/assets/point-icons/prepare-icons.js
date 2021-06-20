#!/usr/bin/env node

/*

This scripts setup icons and create Typescript file for use them.

*/

const fs = require('fs');
const path = require('path');
const camelCase = require('camelcase');

main('twbs');

function main(directory) {
  const directoryFullPath = path.resolve(__dirname, directory);
  let files = fs.readdirSync(directoryFullPath);

  // Rename files if needed
  for (const file of files) {
    if (file.endsWith('.inline.svg') || !file.endsWith('.svg')) {
      continue;
    }

    const from = path.resolve(directoryFullPath, file);
    const to = path.resolve(directoryFullPath, `${file.replace('.svg', '')}.inline.svg`);
    fs.renameSync(from, to);
  }
  files = fs.readdirSync(directoryFullPath);

  // Create PointIconName.ts
  let enumMembers = '';
  for (const file of files) {
    if (!file.endsWith('.inline.svg')) {
      continue;
    }

    enumMembers += `${fileToIconName(file)}="${directory}/${file}",\n`;
  }
  fs.writeFileSync('PointIconName.ts', enumTemplate(enumMembers));

  // Create icons.ts
  let imports = `import {PointIconName} from "./PointIconName"\n`;
  let icons = '';
  for (const file of files) {
    if (!file.endsWith('.inline.svg')) {
      continue;
    }

    const safeName = fileToIconName(file);
    imports += `import ${safeName} from "./${directory}/${file}"\n`;
    icons += `{ name: PointIconName.${safeName}, contentSvg: ${safeName} },\n`;
  }
  fs.writeFileSync('icons.ts', iconsTemplate(imports, icons));
}

function fileToIconName(file) {
  return `Icon${camelCase(file.replace('.inline.svg', ''), { pascalCase: true })}`;
}

function enumTemplate(content) {
  return `
export enum PointIconName {
  ${content}
}

export const AllIconNames = Object.values(PointIconName);

`;
}

function iconsTemplate(imports, icons) {
  return `
${imports}

export const AllIcons = [
  ${icons}
]

`;
}
