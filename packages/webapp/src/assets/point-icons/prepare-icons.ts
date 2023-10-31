#!/usr/bin/env node
/**
 * Copyright © 2023 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const camelcase = require('camelcase');

/*
 * This script prepare a directory of SVG files for icon usage, and generate typescript code.
 *
 * Usage:
 *
 *      $ ts-node prepare-icons.ts
 *
 */

interface Settings {
  directoryName: string;
  category: string;
  staticColors: boolean;
}

main({ directoryName: 'iso7010', category: 'Iso7010', staticColors: true }).catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main(options: Settings) {
  const { directoryName, category, staticColors } = options;
  const targetFullPath = path.resolve(__dirname, directoryName);

  let fileNames = fs.readdirSync(targetFullPath);

  // Rename files if needed
  renameFiles(targetFullPath, fileNames);
  fileNames = fs.readdirSync(targetFullPath);

  // We fix svg
  await fixSvgs(targetFullPath, fileNames);

  // Create generated-PointIcon.ts
  generatePointIconsDotTs(directoryName, fileNames);

  // Create file generated-icons.ts
  generateIconsFileDotTs(directoryName, category, staticColors, fileNames);

  console.log('Done. See generated-icons.ts and generated-PointIcon.ts');
}

function renameFiles(targetFullPath: string, fileNames: string[]) {
  for (const file of fileNames) {
    if (file.endsWith('.inline.svg') || !file.endsWith('.svg')) {
      continue;
    }

    const from = path.resolve(targetFullPath, file);
    const to = path.resolve(
      targetFullPath,
      `${file
        .replaceAll('.svg', '')
        .replaceAll(/[^a-z0-9-]+/gi, '-')
        .replaceAll(/-$/gi, '')}.inline.svg`
    );
    fs.renameSync(from, to);
  }
}

async function fixSvgs(targetFullPath: string, fileNames: string[]) {
  const parser = new xml2js.Parser(/* options */);
  const builder = new xml2js.Builder();
  for (const file of fileNames) {
    const filePath = path.resolve(targetFullPath, file);
    const fileContent = fs.readFileSync(filePath).toString('utf-8');
    const xml = await parser.parseStringPromise(fileContent);

    // We remove sensitive svg parts. Some properties can hurt svg rendering with openlayers.
    cleanXmlObject(xml);

    // We add missing svg view boxes
    fixSvgViewBoxes(xml);

    const cleaned = builder.buildObject(xml);
    if (cleaned !== fileContent) {
      fs.writeFileSync(filePath, cleaned);
    }
  }
}

function generatePointIconsDotTs(directoryName: string, fileNames: string[]) {
  let enumMembers = '';
  for (const file of fileNames) {
    if (!file.endsWith('.inline.svg')) {
      continue;
    }

    enumMembers += `${fileToIconName(file)}="${directoryName}/${file}",\n`;
  }
  fs.writeFileSync('generated-PointIcon.ts', pointIconDotTsTemplate(enumMembers));
}

function generateIconsFileDotTs(directoryName: string, category: string, staticColors: boolean, fileNames: string[]) {
  let imports = `import {IconName} from "./IconName"\n`;
  let icons = '';
  for (const file of fileNames) {
    if (!file.endsWith('.inline.svg')) {
      continue;
    }

    const safeName = fileToIconName(file);
    imports += `import ${safeName} from "./${directoryName}/${file}"\n`;
    icons += `{ name: IconName.${safeName}, contentSvg: ${safeName}, category: IconCategory.${category}, staticColors: ${staticColors} },\n`;
  }
  fs.writeFileSync('generated-icons.ts', iconsDotTsTemplate(imports, icons));
}

const xmlPropertiesToClean = ['metadata', 'sodipodi', 'inkscape', 'xmlns:dc', 'xmlns:cc', 'xmlns:rdf'];
function cleanXmlObject(xml: unknown) {
  if (!xml || typeof xml !== 'object') {
    return;
  }
  const xmlObj = xml as { [k: string]: unknown };

  for (const k of Object.keys(xmlObj)) {
    if (xmlPropertiesToClean.includes(k)) {
      delete xmlObj[k];
    }

    cleanXmlObject(xmlObj[k]);
  }
}

function fixSvgViewBoxes(xml: any) {
  if (!xml.svg || typeof xml.svg !== 'object') {
    return;
  }

  if (xml.svg['$'].viewBox) {
    return;
  }

  const width = xml.svg['$'].width;
  const height = xml.svg['$'].height;
  if (typeof width === 'undefined' || typeof height === 'undefined') {
    return;
  }

  const vbWidth = Math.round(parseFloat(width.replaceAll(/[^\.0-9]+/gi, '')));
  const vbHeight = Math.round(parseFloat(height.replaceAll(/[^\.0-9]+/gi, '')));
  xml.svg['$'].viewBox = `0 0 ${vbWidth} ${vbHeight}`;
}

function fileToIconName(fileName: string) {
  return `Icon${camelcase(fileName.replace('.inline.svg', ''), { pascalCase: true })}`;
}

function pointIconDotTsTemplate(content: string) {
  return `
export enum IconName {
  ${content}
}
`;
}

function iconsDotTsTemplate(imports: string, icons: string) {
  return `
${imports}

export const AllIcons = [
  ${icons}
]

`;
}
